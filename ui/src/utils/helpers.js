
export const rideLengthConversions = {
  'All': '',
  '15 min': 900,
  '20 min': 1200,
  '30 min': 1800,
  '45 min': 2700,
  '60 min': 3600
}

export function formatDate(unixTime) {
  const d = new Date(unixTime * 1000);
  const dateString = d.toLocaleDateString([], { day: 'numeric', month: 'numeric', year: '2-digit' });
  const timeString = d.toLocaleTimeString([], { hour: 'numeric', minute:'2-digit' });

  return dateString + ' @ ' + timeString;
}

export const instructorMap = {
  "b8c2734e18a7496fa146b3a42465da67": "Aditi Shah",
  "f962a2b1b34d424cabab73bef81bc8db": "Adrian Williams",
  "a8c56f162c964e9392568bc13828a3fb": "Anna Greenberg",
  "2e57092bee334c8c8dcb9fe16ba5308c": "Alex Toussaint",
  "731d7b7f6b414a49892c21f01e25317d": "Ally Love",
  "c9fa21c2004c4544a7c35c28a6196c77": "Andy Speer",
  "286fc17080d34406a54b80ad8ff83e12": "Becs Gentry",
  "7f3de5e78bb44d8591a0f77f760478c3": "Ben Alldis",
  "01f636dc54a145239c4348e1736684ee": "Bradley Rose",
  "1423df9e4ad64a84a3044d20a5c36563": "Chase Tucker",
  "e2e6586d898d4422b3f6e3a259ff3f90": "Cliff Dwenger",
  "0021e2220a7940cf94a7647b1e4bae6c": "Chelsea Jackson Roberts",
  "5a19bfe66e644a2fa3e6387a91ebc5ce": "Christine D'Ercole",
  "baf5dfb4c6ac4968b2cb7f8f8cc0ef10": "Cody Rigsby",
  "1e59e949a19341539214a4a13ea7ff01": "Denis Morton",
  "f6f2d613dc344e4bbf6428cd34697820": "Emma Lovewell",
  "017dd08b095346979ddf761eb49f9f67": "Erik Jäger",
  "561f95c405734d8488ed8dcc8980d599": "Hannah Corbin",
  "3ff679ebbd324c83a8ab6cfa6bb4be37": "Hannah Frankson",
  "9c67c1b94e5d4ad5a1cbe439ac62eb75": "Irène Scholz",
  "51702da3a4684b988d31d89eebb43175": "Jenn Sherman",
  "1b79e462bd564b6ca5ec728f1a5c2af0": "Jess Sims",
  "048f0ce00edb4427b2dced6cbeb107fd": "Jess King",
  "4904612965164231a37143805a387e40": "Kendall Toole",
  "f48347e0fb3748c08aa6c6e031b48897": "Kristin McGee",
  "c0a9505d8135412d824cf3c97406179b": "Leanne Hainsby",
  "304389e2bfe44830854e071bffc137c9": "Matt Wilpers",
  "a606b2c39c194bcc80f9a541b97b4537": "Matty Maggiacomo",
  "0e836f86aa9c488782452243f2e17170": "Mayla Wedekind",
  "05735e106f0747d2a112d32678be8afd": "Olivia Amato",
  "efd71bafb8c544e98a8d3882531f2976": "Rebecca Kennedy",
  "c406f36aa2a44a5baf8831f8b92f6920": "Robin Arzón",
  "a4b1a372a14a442cb2d729dc34bd2596": "Ross Rayburn",
  "4672db841da0495caf4b8f9cda405512": "Sam Yo",
  "040ab78d62a74cfc9954c0e320815993": "Selena Samuela",
  "c9bd86e59b9b4f96981848467838aa9c": "Tunde Oyeneyin",
  "35016225e39d46dbbc364991ab48e10f": "Christian Vande Velde",
}
