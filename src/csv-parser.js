const csv = require('csv-parser')
const stream = require('stream')

module.exports = {
  async parse(req, res) {
    try {
      if (req.body.spreadsheet) {
        const bufferStream = new stream.PassThrough();
        req.body.spreadsheet = req.body.spreadsheet.base64.split(',').reverse()[0];
        req.body.spreadsheet = Buffer.from(req.body.spreadsheet, 'base64').toString('utf-8');
        if (req.body.spreadsheet.charCodeAt(0) === 0xFEFF) {
          req.body.spreadsheet = req.body.spreadsheet.substr(1);
        }
        bufferStream.end(req.body.spreadsheet);
        let rows = await new Promise((resolve, reject) => {
          const results = [];
          bufferStream
            .pipe(csv({ separator: req.body.separator }))
            .on('data', (data) => results.push(data))
            .on('error', reject)
            .on('end', () => {
              resolve(results);
            });
        });

        rows = rows.filter((row) => Object.keys(row).length !== 0);

        res.json(rows)
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err.error)
    }
  }
}