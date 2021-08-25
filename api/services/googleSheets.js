const {google} = require('googleapis');
const sheets = google.sheets('v4');

async function main() {
    
const auth = new google.auth.GoogleAuth({
  keyFile: 'keys.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

//   const authClient = await authorize();
  const request = {
    // The spreadsheet to request.
    spreadsheetId: 'some id',  // TODO: Update placeholder value.

    // The ranges to retrieve from the spreadsheet.
    // ranges: [],  // TODO: Update placeholder value.
range: "!A:D",
    // // True if grid data should be returned.
    // // This parameter is ignored if a field mask was set in the request.
    // includeGridData: false,  // TODO: Update placeholder value.

    auth: auth,
  };

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;
    // TODO: Change code below to process the `response` object:
    //   const jsonResponse = JSON.stringify(response.values, null, 2)
    //   console.log('json response:', jsonResponse);
      const result = response.values
     
      let obj1 = result.find(el => el[0] === '21894')
      console.log('row:', obj1)
     
      if (obj1) {
          console.log('Code:', obj1[2])
      }
      
      
    //   let obj1 = jsonResponse.find(o => o.Id);
    //   console.log(obj1)
//   if(obj1) {
//     console.log(obj1.Code)
//   }

  } catch (err) {
    console.error(err);
  }
}
main();

// async function authorize() {
//   // TODO: Change placeholder below to generate authentication credentials. See
//   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
//   keyFile: 'credentials.json',
//   scopes: 'https://www.googleapis.com/auth/spreadsheets'
//   // Authorize using one of the following scopes:
//     // 'https://www.googleapis.com/auth/drive'
//     // 'https://www.googleapis.com/auth/drive.file'
//     // 'https://www.googleapis.com/auth/drive.readonly'
//     // 'https://www.googleapis.com/auth/spreadsheets'
//     // 'https://www.googleapis.com/auth/spreadsheets.readonly'
//   let authClient = null;

//   if (authClient == null) {
//     throw Error('authentication failed');
//   }

//   return authClient;
// }

