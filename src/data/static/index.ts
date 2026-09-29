/**
 * Static Seed & Initial Reference Data
 * 
 * NOTE: These files are strictly separated as static initial/seed reference data.
 * Dynamic database content and items created through the Admin section or public forms
 * are stored in the PostgreSQL (Neon) database and must NEVER be overwritten by these static defaults.
 */

export { ANNOUNCEMENTS as STATIC_ANNOUNCEMENTS } from './initialAnnouncements';
export { JCCF_EVENTS as STATIC_EVENTS } from './initialEvents';
export { MEMBER_FELLOWSHIPS as STATIC_FELLOWSHIPS } from './initialFellowships';
export { CENTRAL_EXECUTIVES as STATIC_EXECUTIVES, HISTORICAL_EXECUTIVES as STATIC_HISTORICAL_EXECUTIVES } from './initialExecutives';
export { MEDIA_RECORDS as STATIC_MEDIA } from './initialMedia';
export { RESOURCES_LIST as STATIC_RESOURCES } from './initialResources';
export { SERVICE_UNITS as STATIC_UNITS } from './initialUnits';
