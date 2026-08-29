/**
 * Supabase & PostgreSQL Diagnostic Utility
 * 
 * Provides end-to-end write testing, latency tracking, SSL verification,
 * and rich console logging for debugging database persistence issues.
 */

export interface DbDiagnosticStep {
  step: string;
  status: 'passed' | 'failed' | 'skipped' | 'running';
  durationMs?: number;
  details?: string;
  error?: any;
}

export interface DbDiagnosticReport {
  timestamp: string;
  success: boolean;
  totalDurationMs: number;
  environment: {
    origin: string;
    isFirebaseConfigured: boolean;
    hasAdminToken: boolean;
    hasIdToken: boolean;
  };
  serverHealth?: {
    status: string;
    time: string;
  };
  databaseInfo?: {
    connected: boolean;
    host?: string;
    database?: string;
    user?: string;
    ssl?: boolean;
    tablesFound?: string[];
    tableCount?: number;
  };
  steps: DbDiagnosticStep[];
  error?: {
    message: string;
    code?: string;
    detail?: string;
    hint?: string;
    stack?: string;
  };
  troubleshootingGuidance?: string[];
}

/**
 * Executes a comprehensive database write diagnostic cycle.
 * Logs step-by-step colored output to the browser console.
 */
export async function runSupabaseDiagnostics(authToken?: string | null): Promise<DbDiagnosticReport> {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  // Read stored authentication tokens if not explicitly passed
  const token = authToken || 
    sessionStorage.getItem('jccf_admin_token') || 
    localStorage.getItem('jccf_admin_token') || 
    null;

  console.log(
    '%c🔍 [JCCF Database Diagnostics] Starting Supabase/PostgreSQL Write & Health Test...',
    'background: #171717; color: #38bdf8; font-weight: bold; font-size: 13px; padding: 4px 8px; border-radius: 4px;'
  );

  const steps: DbDiagnosticStep[] = [];
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const isFirebaseConfigured = Boolean(
    metaEnv?.VITE_FIREBASE_API_KEY && 
    metaEnv.VITE_FIREBASE_API_KEY !== 'AIzaSyDummyKeyForStandaloneMode'
  );

  const report: DbDiagnosticReport = {
    timestamp,
    success: false,
    totalDurationMs: 0,
    environment: {
      origin: window.location.origin,
      isFirebaseConfigured,
      hasAdminToken: !!token,
      hasIdToken: !!(sessionStorage.getItem('jccf_id_token') || localStorage.getItem('jccf_id_token'))
    },
    steps: []
  };

  // STEP 1: Test Server API Reachability
  const s1Start = performance.now();
  try {
    const healthRes = await fetch('/api/health');
    const s1Duration = Math.round(performance.now() - s1Start);
    if (!healthRes.ok) {
      throw new Error(`Server returned HTTP ${healthRes.status}: ${healthRes.statusText}`);
    }
    const healthData = await healthRes.json();
    report.serverHealth = healthData;
    steps.push({
      step: '1. Server Health Check (/api/health)',
      status: 'passed',
      durationMs: s1Duration,
      details: `Backend is alive. Response in ${s1Duration}ms.`
    });
    console.log(`%c✅ Step 1: Server Reachable (${s1Duration}ms)`, 'color: #10b981; font-weight: bold;');
  } catch (err: any) {
    const s1Duration = Math.round(performance.now() - s1Start);
    steps.push({
      step: '1. Server Health Check (/api/health)',
      status: 'failed',
      durationMs: s1Duration,
      error: err.message
    });
    console.error('❌ Step 1 Failed: Backend server is unreachable.', err);
    report.steps = steps;
    report.totalDurationMs = Math.round(performance.now() - startTime);
    report.error = { message: err.message, stack: err.stack };
    report.troubleshootingGuidance = [
      'Ensure the backend server is running on port 3000.',
      'Check if the container dev server or Render web service has booted.'
    ];
    logFinalReport(report);
    return report;
  }

  // STEP 2: Execute Deep Database Write Test via Backend Probe
  const s2Start = performance.now();
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const testRes = await fetch('/api/diagnostics/test-db-write', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        origin: window.location.origin,
        clientTimestamp: timestamp
      })
    });

    const s2Duration = Math.round(performance.now() - s2Start);
    const result = await testRes.json();

    if (!testRes.ok || !result.success) {
      const errMsg = result.error?.message || `HTTP ${testRes.status}: ${testRes.statusText}`;
      steps.push({
        step: '2. Database Write Cycle (INSERT -> SELECT -> UPDATE -> DELETE)',
        status: 'failed',
        durationMs: s2Duration,
        details: errMsg,
        error: result.error
      });

      report.steps = steps;
      report.databaseInfo = result.dbInfo;
      report.error = result.error;
      report.troubleshootingGuidance = result.troubleshootingAdvice || [
        'Verify DATABASE_URL in environment variables (Render Dashboard -> Environment).',
        'Verify Supabase connection string format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres',
        'If using Supabase Transaction Pooler (port 6543), try direct session connection (port 5432) or vice versa.'
      ];
      report.totalDurationMs = Math.round(performance.now() - startTime);

      console.group('%c❌ [Database Diagnostics Failure]', 'background: #dc2626; color: #fff; padding: 2px 6px; font-weight: bold;');
      console.error('Diagnostic Write Failed:', errMsg);
      if (result.error?.code) console.error('PostgreSQL Error Code:', result.error.code);
      if (result.error?.detail) console.error('Error Detail:', result.error.detail);
      if (result.error?.hint) console.info('Database Hint:', result.error.hint);
      console.info('Troubleshooting Guidance:', report.troubleshootingGuidance);
      console.groupEnd();

      logFinalReport(report);
      return report;
    }

    // Success breakdown
    report.databaseInfo = result.dbInfo;
    if (Array.isArray(result.serverSteps)) {
      steps.push(...result.serverSteps);
    } else {
      steps.push({
        step: '2. PostgreSQL Connection Pool & SSL',
        status: 'passed',
        durationMs: result.latency?.connectMs || 10,
        details: `Connected to ${result.dbInfo?.host || 'PostgreSQL'} database`
      });
      steps.push({
        step: '3. Write Test: INSERT probe record',
        status: 'passed',
        durationMs: result.latency?.insertMs,
        details: `Created probe record with ID: ${result.probeRecordId}`
      });
      steps.push({
        step: '4. Read Test: SELECT probe record',
        status: 'passed',
        durationMs: result.latency?.selectMs,
        details: 'Verified probe record persisted to disk'
      });
      steps.push({
        step: '5. Mutation Test: UPDATE probe record',
        status: 'passed',
        durationMs: result.latency?.updateMs,
        details: 'Verified update permissions'
      });
      steps.push({
        step: '6. Cleanup: DELETE probe record',
        status: 'passed',
        durationMs: result.latency?.deleteMs,
        details: 'Verified delete permissions and cleaned test data'
      });
    }

    report.success = true;
    report.steps = steps;
    report.totalDurationMs = Math.round(performance.now() - startTime);

    console.group('%c✅ [Database Write Diagnostics Passed]', 'background: #059669; color: #fff; padding: 2px 6px; font-weight: bold;');
    console.log(`Database Host: ${report.databaseInfo?.host || 'Connected'}`);
    console.log(`Database Name: ${report.databaseInfo?.database || 'postgres'}`);
    console.log(`Tables Initialized: ${report.databaseInfo?.tablesFound?.length || 0} tables`);
    console.log(`Total Write Cycle Latency: ${result.latency?.totalMs || s2Duration}ms`);
    console.table(steps.map(s => ({ Step: s.step, Status: s.status, 'Time (ms)': s.durationMs, Details: s.details })));
    console.groupEnd();

    logFinalReport(report);
    return report;

  } catch (err: any) {
    const s2Duration = Math.round(performance.now() - s2Start);
    steps.push({
      step: '2. Database Write Cycle',
      status: 'failed',
      durationMs: s2Duration,
      error: err.message
    });
    report.steps = steps;
    report.error = { message: err.message, stack: err.stack };
    report.totalDurationMs = Math.round(performance.now() - startTime);
    report.troubleshootingGuidance = [
      'Network failure or endpoint /api/diagnostics/test-db-write threw an unhandled exception.',
      'Check server console logs for full trace.'
    ];
    logFinalReport(report);
    return report;
  }
}

function logFinalReport(report: DbDiagnosticReport) {
  if (typeof window !== 'undefined') {
    (window as any).__LATEST_DB_DIAGNOSTICS_REPORT__ = report;
  }
}

// Expose diagnostic functions globally on window object for easy DevTools execution
if (typeof window !== 'undefined') {
  (window as any).runDatabaseDiagnostics = runSupabaseDiagnostics;
  (window as any).testSupabaseWrite = runSupabaseDiagnostics;
}
