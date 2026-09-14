export const LINKS = {
  email: 'soubhikchakraborty76@gmail.com',
  linkedin: 'https://linkedin.com/in/soubhikchakraborty76',
  phone: '+91 8274022133',
}

export const LOG_LINES = [
  '✓ interface 07/21 loaded · 1,000,000 rows (no, really, all of them this time)',
  '✓ schema drift check passed · vendor did NOT rename columns today 🎉',
  '⚠ finance opened dashboard… did NOT export to Excel (witnesses confirm)',
  '✓ AR ageing reconciled · FIFO netting matches FBL5N to the rupee',
  '✓ NACH H2H job ran unattended · nobody\'s morning was ruined',
  '✓ vendor #3 asked for 40 days · negotiated to 12 + chargeback clause',
  '✓ row-cap detector armed · truncation will fail LOUDLY, not quietly',
  '⚠ stakeholder said "quick dashboard" · translating to 3 sprints…',
  '✓ governance SOP v2.0 adopted · the template people actually use',
  '✓ SAP ACDOCA extracted · 4M rows, zero tears shed',
]

export const EXCUSES = [
  'The vendor renamed a column from "Amount" to "Amount_NEW_FINAL_v2". At 4:58pm. On a Friday.',
  'A million-row cap truncated the feed. The dashboard looked fine. The totals did not.',
  'Someone "cleaned up" the SharePoint folder containing the only mapping doc.',
  'SAP said the OData endpoint was "temporarily" unavailable. Temporarily lasted 11 days.',
  'Finance and the pipeline disagreed on FIFO. Finance was right. Finance is always right.',
  'The scheduled refresh ran perfectly - in the wrong timezone, against last quarter.',
  'A well-meaning intern sorted the source Excel by colour.',
  'The API returned HTTP 200 with an error message inside. A 200! With an error!',
  'Two portals, same vendor, different schemas. No versioning. Just vibes.',
  'The job failed silently for 6 days. Nobody noticed because the old numbers "looked plausible".',
]

export const DEPLOY_OUTCOMES = [
  { ok: false, msg: 'FAILED: Finance exported to Excel to double-check. Trust reset to 0.' },
  { ok: false, msg: 'FAILED: Vendor renamed a column mid-deploy. Classic.' },
  { ok: false, msg: 'FAILED: Row cap hit at 1,000,000 rows. Again. AGAIN.' },
  { ok: false, msg: 'FAILED: Staging was green. Prod was… a different schema. How.' },
  { ok: false, msg: 'FAILED: Someone scheduled a refresh inside another refresh. Refresh-ception.' },
  { ok: true, msg: 'SUCCESS: All 21 interfaces green. Finance nodded once. Frame that nod.' },
]

export const QUIZ = [
  {
    q: 'A stakeholder says "the dashboard is wrong". What do you check first?',
    options: ['The DAX measure', 'The source table, at row level', 'Your horoscope'],
    answer: 1,
    snark: 'Always read the source first. The model is just gossip about the source.',
  },
  {
    q: 'A pipeline fails silently for a week. What is it?',
    options: ['A minor bug', 'A credibility problem surfacing in a board meeting', 'A feature'],
    answer: 1,
    snark: 'Loud failures are maintenance. Quiet failures are career events.',
  },
  {
    q: 'Finance still exports your dashboard to Excel. Has it shipped?',
    options: ['Yes, adoption takes time', 'No. It has not shipped yet.', 'Excel IS the dashboard'],
    answer: 1,
    snark: 'Time-to-trust is the only KPI. Everything else is decoration.',
  },
  {
    q: 'A vendor quotes 40 days for a 12-day task. You…',
    options: ['Accept politely', 'Challenge the estimate, scope it, track it, chargeback if needed', 'Cry'],
    answer: 1,
    snark: 'Good partners need clear asks and someone tracking commitments. That someone is you.',
  },
  {
    q: 'SELECT * FROM prod WHERE common_sense = true returns…',
    options: ['0 rows', '1 row (you)', 'NULL - obviously'],
    answer: 0,
    snark: 'In prod, common sense is the rarest dimension. Never inner-join on hope.',
  },
]

export const JOBS = [
  {
    yr: '2024 - Present',
    co: 'Hygienic Research Institute',
    ro: 'Senior Engineer, Data & AI',
    dd: 'Fabric warehouse + SAP extraction pipelines, Power BI for Finance, 5 vendor relationships owned end-to-end, plus the governance and hiring bar the team works to.',
    img: 'https://picsum.photos/seed/laboratory/900/1100',
    logo: 'logos/hri.svg',
    short: 'HRI',
  },
  {
    yr: '2023 - 2024',
    co: 'SUGAR Cosmetics',
    ro: 'Data Analyst, Senior Executive',
    dd: 'Redshift warehouse across Netsuite, Shopify, Clickpost & Wondersoft. Order-journey tracking + marketplace fee reconciliation that recovered real margin.',
    img: 'https://picsum.photos/seed/cosmeticsshelf/900/1100',
    logo: 'logos/sugar.png',
    short: 'SUGAR',
  },
  {
    yr: '2022 - 2023',
    co: 'Cognizant',
    ro: 'Programmer Analyst',
    dd: 'Cloud migration for an APAC insurer. Pipeline validation, data-quality rules, Power BI reporting delivered directly to client stakeholders.',
    img: 'https://picsum.photos/seed/glassoffice/900/1100',
    logo: 'logos/cognizant.svg',
    short: 'CTS',
  },
]

export const STACK = [
  { name: 'Python', icon: 'icons/python.svg' },
  { name: 'Django', icon: 'icons/django.svg' },
  { name: 'SAP HANA', icon: 'icons/sap.svg' },
  { name: 'Fabric', icon: 'icons/fabric.svg' },
  { name: 'Power BI', icon: 'icons/powerbi.svg' },
  { name: 'T-SQL', icon: 'icons/sqlserver.svg' },
  { name: 'Azure', icon: 'icons/azure.svg' },
  { name: 'Excel', icon: 'icons/excel.svg' },
  { name: 'Teams', icon: 'icons/teams.svg' },
  { name: 'SharePoint', icon: 'icons/sharepoint.svg' },
  { name: 'Power Apps', icon: 'icons/powerapps.svg' },
  { name: 'Power Automate', icon: 'icons/powerautomate.svg' },
  { name: 'Redshift', icon: 'icons/redshift.svg' },
  { name: 'Graph API', icon: null },
]

export const HOW = [
  {
    no: '01',
    h: 'Read the source before modelling it',
    p: 'Table-level familiarity is not optional. If I have not looked at the raw fields, I am guessing at semantics and passing that guess downstream.',
    pf: 'SAP HANA + OData across ACDOCA, EKKO/EKPO, MATDOC, FAGLL03 - validated against the dictionary, not assumed.',
  },
  {
    no: '02',
    h: 'Build for the failure, not the happy path',
    p: 'A pipeline that fails loudly is a maintenance task. One that fails quietly is a credibility problem that surfaces in a board meeting.',
    pf: 'Row-cap detection, schema-drift alerts and load dashboards on a 21-interface vendor feed.',
  },
  {
    no: '03',
    h: 'Prove the numbers, do not assert them',
    p: 'Finance does not need convincing by presentation. They need a reconciliation they can run themselves.',
    pf: 'Every ageing + clearing rebuild shipped with a Python reconciliation script attached.',
  },
  {
    no: '04',
    h: 'Hold vendors to what they committed',
    p: 'External partners deliver well when the ask is specific and someone tracks the commitment. That someone is usually the engineer, not the contract.',
    pf: 'Five partnerships via scoping, effort challenge, chargeback validation, on-site closure.',
  },
  {
    no: '05',
    h: 'Document for whoever inherits it',
    p: 'A standard only works if the next person reaches for it without being told. That is a writing problem as much as an engineering one.',
    pf: 'BI Governance SOP v2.0 + unified PRD template adopted portfolio-wide.',
  },
]

export const QUOTES = [  {
    big: 'Adoption is not logins. It is the day someone quotes your number in a meeting without hedging first.',
    small: 'The KPI that never appears on a job description',
  },
  {
    big: 'If Finance still exports to Excel to double-check the dashboard, the dashboard has not shipped yet.',
    small: 'How I decide whether a build is finished',
  },
  {
    big: 'Good vendors are not managed by contracts. They are managed by a specific ask and someone who tracks it.',
    small: 'What five partnerships taught me',
  },
]

export const CATS = [
  ['all', 'All work'],
  ['apps', 'Web apps'],
  ['auto', 'Automations'],
  ['fmcg', 'FMCG usecases'],
]

export const PROJECTS = [
  {
    cat: 'apps', title: 'Order Journey Tracker',
    use: 'Every D2C order, checkout to doorstep, in one live timeline.',
    stack: 'Redshift · Shopify · Clickpost', metric: '4 systems → 1 view',
  },
  {
    cat: 'apps', title: 'Chargeback Tracker',
    use: 'Vendor claims filed, evidenced and charged back - with a paper trail.',
    stack: 'Django · Fabric · T-SQL', metric: '5 vendors, held to terms',
  },
  {
    cat: 'apps', title: 'Feed Load Monitor',
    use: 'Live health for 21 distributor interfaces. Failures fail loudly.',
    stack: 'Fabric · Power BI', metric: '21 feeds watched',
  },
  {
    cat: 'auto', title: 'NACH H2H Runner',
    use: 'Bank files fetched, AES-decrypted, transformed and FTP’d - before anyone wakes.',
    stack: 'Python · Graph API · AES', metric: '0 mornings ruined',
  },
  {
    cat: 'auto', title: 'Ageing Reconciler',
    use: 'Proves the BI ageing model against SAP FIFO logic, line by line.',
    stack: 'Python · SAP FBL5N', metric: 'matched to the rupee',
  },
  {
    cat: 'auto', title: 'Feed Loader',
    use: 'Row-cap trips, schema-drift alarms, reorder-proof incremental loads.',
    stack: 'Python · T-SQL', metric: '1M-row cap tamed',
  },
  {
    cat: 'fmcg', title: 'Secondary-Sales Truth',
    use: 'Distributor sales reconciled to one number leadership stops debating.',
    stack: 'Fabric · SAP HANA', metric: '21 feeds → 1 number',
  },
  {
    cat: 'fmcg', title: 'Marketplace Fee Recovery',
    use: 'Fee mismatches against marketplaces, found and recovered as margin.',
    stack: 'Redshift · Netsuite', metric: 'margin recovered',
  },
  {
    cat: 'fmcg', title: 'Warehouse Accuracy Rebuild',
    use: 'Slotting and dispatch reporting rebuilt end to end.',
    stack: 'Power BI · T-SQL', metric: '-90% errors · -40% time',
  },
]
