const { Client } = require('pg');

const connStr = 'postgresql://postgres.prtpmohrikfdasfmzvyt:LYAHEG!5G7gKe&qe@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new Client({
    connectionString: connStr,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    const turkishKeywords = [
      'istanbul', 'ankara', 'izmir', 'antalya', 'eskisehir', 'bursa', 
      'kayseri', 'trabzon', 'gaziantep', 'konya', 'adana', 'mersin',
      'kibris', 'lefkoşa', 'girne', 'cyprus', 'mediterran',
      'bahcesehir', 'isik', 'bilkent', 'ozyegin', 'yeditepe', 
      'beykent', 'atilim', 'kadir has', 'nisantasi', 'baskent',
      'sehir', 'yeni yuzyil', 'ted', 'sabahattin zaim', 'beykoz',
      'sisli', 'maltepe', 'mef', 'esenyurt', 'fenerbahce',
      'fatih sultan mehmet', 'final', 'medipol', 'ostim', 'biruni',
      'galata', 'bilim', 'atlas', 'uskudar', 'sabanci', 'gumushane',
      'ibn haldun', 'acibadem', 'lokman hekim', 'yuksek ihtisas',
      'near east'
    ];

    const knownTurkish = [
      "Bahcesehir Istanbul University",
      "Isik University",
      "Bilkent University",
      "Ozyegin University",
      "Istanbul Kultur University",
      "Yeditepe University",
      "Beykent University",
      "Atilim University",
      "University of Kyrenia",
      "Kadir Has University",
      "Istanbul Nisantasi University",
      "Baskent University",
      "Istanbul Sehir University",
      "Istanbul Yeni Yuzyil University",
      "TED University",
      "Istanbul Sabahattin Zaim University",
      "Beykoz University",
      "Sisli Vocational School",
      "Maltepe University",
      "Eastern Mediterranean University",
      "Izmir University of Economics",
      "MEF University",
      "Istanbul Esenyurt University",
      "Fenerbahce University",
      "Fatih Sultan Mehmet University",
      "Final International University",
      "Ankara Medipol University",
      "OSTiM Technical University",
      "Biruni University",
      "Istanbul Galata University",
      "Ankara Bilim University",
      "Istanbul Atlas University",
      "Uskudar University",
      "Sabanci University",
      "Gumushane University",
      "Ibn Haldun University",
      "Acibadem University",
      "Lokman Hekim University",
      "Yuksek Ihtisas University",
      "Near East University",
      "Health and Social Sciences University of Cyprus"
    ];

    function isTurkish(name) {
      const norm = name.toLowerCase();
      if (norm.includes('london') || norm.includes('uk') || norm.includes('malaysia') || 
          norm.includes('warsaw') || norm.includes('poland') || norm.includes('usa') ||
          norm.includes('florida') || norm.includes('california') || norm.includes('texas') ||
          norm.includes('canada') || norm.includes('sydney') || norm.includes('toronto')) {
        return false;
      }
      for (const t of knownTurkish) {
        if (norm === t.toLowerCase()) return true;
      }
      for (const kw of turkishKeywords) {
        if (norm.includes(kw)) return true;
      }
      return false;
    }

    const { rows } = await client.query('SELECT id, name FROM universities');
    console.log('Total universities:', rows.length);

    const nonTurkishIds = rows.filter(r => !isTurkish(r.name)).map(r => r.id);
    console.log('Non-Turkish to delete:', nonTurkishIds.length);

    if (nonTurkishIds.length > 0) {
      // Create parameterized query or use ANY
      const deleteQuery = `DELETE FROM universities WHERE id = ANY($1::uuid[])`;
      const result = await client.query(deleteQuery, [nonTurkishIds]);
      console.log('Deleted rows:', result.rowCount);
    }
    
    // Check remaining in DB
    const res = await client.query(`SELECT count(*) FROM universities`);
    console.log('Remaining universities:', res.rows[0].count);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
