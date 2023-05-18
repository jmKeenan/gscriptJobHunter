
/**
 * Gets the CX for custom Search
 * @returns {string}
 */
const getCX_ = () => PropertiesService.getScriptProperties().getProperty('CX')

/**
 * Gets the key for custom search
 * @returns {string}
 */
const getKey_ = () => PropertiesService.getScriptProperties().getProperty('key')

/**
 * Sets the key for custom search
 * @param {string} cx
 */
//const setCX = (cx = 'YOUR CX' ) => PropertiesService.getScriptProperties().setProperty('CX',cx)

/**
 * Sets the key for custom search
 * @param {string} key
 */
//const setKey = (key = 'YOUR KEY') => PropertiesService.getScriptProperties().setProperty('key', key)

/**
 * will change this to an object to map variable names to header values
 * @returns {Array<string>}
 */
//const configHeader = () => ['sheetName', 'search',	'run', 'daysBack'	]																				

/**
 * Open the config sheet, if there are searches to run, then run them
 * 
 */
function dailyJob(){

  const ss = SpreadsheetApp.getActive();
  const configSheet = ss.getSheetByName('config')
  const configData = configSheet .getRange(1,1, configSheet.getLastRow(), configSheet.getLastColumn()).getValues()
  configData.forEach(([sheetName, search,	run, daysBack]) => {
    const sheet = ss.getSheetByName(sheetName) ?? ss.insertSheet(sheetName);
    const queryData = runQuery(search)
    console.log(queryData)
    sheet.getRange(1,1,queryData.length, 6).setValues(formatData(queryData))
  })
}

const formatData = (data) => data.map(({title, link, snippet, metaTitle, metaURL, metaLocation})=> [
  title ?? '', 
  link ?? '', 
  snippet ?? '', 
  metaTitle ?? '', 
  metaURL ?? '', 
  metaLocation ?? ''
])

/*
  { kind: 'customsearch#result',
    title: 'Job Application for Senior Full Stack Developer at Lightspeed ...',
    htmlTitle: 'Job Application for Senior Full Stack Developer at Lightspeed ...',
    link: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
    displayLink: 'boards.greenhouse.io',
    snippet: '20 hours ago ... Comfortable with front-end (React and Typescript preferred) ... Lightspeed is dual-listed on the New York Stock Exchange (NYSE: LSPD) and Toronto Stock ...',
    htmlSnippet: '20 hours ago <b>...</b> Comfortable with front-end (React and <b>Typescript</b> preferred) ... Lightspeed is dual-listed on the <b>New York</b> Stock Exchange (NYSE: LSPD) and Toronto Stock&nbsp;...',
    cacheId: 'OXx8r67XIz4J',
    formattedUrl: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
    htmlFormattedUrl: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
    metaTitle: 'Senior Full Stack Developer',
    metaURL: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
    metaLocation: 'Toronto, Ontario, Canada' } ]
    */

function runQuery(search = 'typescript AND "new york"') {
  const days = 1
  const q = `site:https://boards.greenhouse.io ${search}`
  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(getKey_())}&cx=${getCX_()}&q=${encodeURIComponent(q)}&dateRestrict=d${days}`
  const response = UrlFetchApp.fetch(url);
  const result = JSON.parse(response.getContentText());
  console.log(result.queries.request, result.queries.nextPage)
  return result.items.map(v=> flattenResults(v))
  //result.items.forEach(v=>console.log(v.pagemap.metatags  ))
}

  //const q = 'site:https://boards.greenhouse.io (frontend OR front end OR front-end) AND react AND "new york"'
  //const q = 'site:https://boards.greenhouse.io react.js AND "new york"'
  //const q = 'site:https://boards.greenhouse.io  "Site Reliability" AND "new york"'


/*
{ kind: 'customsearch#result',
  title: 'Job Application for Senior Front End Developer at Exiger',
  htmlTitle: 'Job Application for Senior Front End Developer at Exiger',
  link: 'https://boards.greenhouse.io/exiger/jobs/4888547004',
  displayLink: 'boards.greenhouse.io',
  snippet: '9 hours ago ... ES6; JavaScript transpilers; Typescript; Angular (Angular 2+) ... within the United States, excluding residents of California, Colorado, and New York.',
  htmlSnippet: '9 hours ago <b>...</b> ES6; JavaScript transpilers; <b>Typescript</b>; Angular (Angular 2+) ... within the United States, excluding residents of California, Colorado, and <b>New York</b>.',
  cacheId: 'mlIYw4NVNb0J',
  formattedUrl: 'https://boards.greenhouse.io/exiger/jobs/4888547004',
  htmlFormattedUrl: 'https://boards.greenhouse.io/exiger/jobs/4888547004',
  pagemap: { metatags: [ [Object] ] } } 'https://boards.greenhouse.io/exiger/jobs/4888547004' '9 hours ago ... ES6; JavaScript transpilers; Typescript; Angular (Angular 2+) ... within the United States, excluding residents of California, Colorado, and New York.' 'https://boards.greenhouse.io/exiger/jobs/4888547004'
  */

const flattenResults = ({pagemap, ...data}) => ({
  ...data, 
  //pagemap : pagemap,
  metaTitle : pagemap?.metatags?.[0]?.['og:title'] ?? 'no meta title',
  metaURL :pagemap?.metatags?.[0]?.['og:url'] ?? 'no meta URL', 
  metaLocation : pagemap?.metatags?.[0]?.['og:description'] ?? 'no meta location'})
/*

{ kind: 'customsearch#result',
  title: 'Job Application for Senior Full Stack Developer at Lightspeed ...',
  htmlTitle: 'Job Application for Senior Full Stack Developer at Lightspeed ...',
  link: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
  displayLink: 'boards.greenhouse.io',
  snippet: '19 hours ago ... Comfortable with front-end (React and Typescript preferred) ... Lightspeed is dual-listed on the New York Stock Exchange (NYSE: LSPD) and Toronto Stock ...',
  htmlSnippet: '19 hours ago <b>...</b> Comfortable with front-end (React and <b>Typescript</b> preferred) ... Lightspeed is dual-listed on the <b>New York</b> Stock Exchange (NYSE: LSPD) and Toronto Stock&nbsp;...',
  cacheId: 'OXx8r67XIz4J',
  formattedUrl: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
  htmlFormattedUrl: 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
  pagemap: 
   { cse_thumbnail: [ [Object] ],
     metatags: [ [Object] ],
     cse_image: [ [Object] ] } } 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305' '19 hours ago ... Comfortable with front-end (React and Typescript preferred) ... Lightspeed is dual-listed on the New York Stock Exchange (NYSE: LSPD) and Toronto Stock ...' 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305' [ { 'og:image': 'https://recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/000/001/269/original/Greenhouse_1024x512.png?1616424724',
    'og:type': 'article',
    viewport: 'width=device-width, minimum-scale=1.0',
    'og:title': 'Senior Full Stack Developer',
    'og:url': 'https://boards.greenhouse.io/lightspeedhq/jobs/5055305',
    'og:description': 'Toronto, Ontario, Canada' } ]
    */
