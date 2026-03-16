const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const fs = require('fs');

async function run() {
  const { data: rows } = await supabase.from('universities').select('id, name');
  
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
    'Bahcesehir Istanbul University',
    'Isik University',
    'Bilkent University',
    'Ozyegin University',
    'Istanbul Kultur University',
    'Yeditepe University',
    'Beykent University',
    'Atilim University',
    'University of Kyrenia',
    'Kadir Has University',
    'Istanbul Nisantasi University',
    'Baskent University',
    'Istanbul Sehir University',
    'Istanbul Yeni Yuzyil University',
    'TED University',
    'Istanbul Sabahattin Zaim University',
    'Beykoz University',
    'Sisli Vocational School',
    'Maltepe University',
    'Eastern Mediterranean University',
    'Izmir University of Economics',
    'MEF University',
    'Istanbul Esenyurt University',
    'Fenerbahce University',
    'Fatih Sultan Mehmet University',
    'Final International University',
    'Ankara Medipol University',
    'OSTiM Technical University',
    'Biruni University',
    'Istanbul Galata University',
    'Ankara Bilim University',
    'Istanbul Atlas University',
    'Uskudar University',
    'Sabanci University',
    'Gumushane University',
    'Ibn Haldun University',
    'Acibadem University',
    'Lokman Hekim University',
    'Yuksek Ihtisas University',
    'Near East University',
    'Health and Social Sciences University of Cyprus'
  ];

  function isTurkish(name) {
    const norm = name.toLowerCase();
    if (norm.includes('london') || norm.includes('uk') || norm.includes('malaysia') || 
        norm.includes('warsaw') || norm.includes('poland') || norm.includes('usa') ||
        norm.includes('florida') || norm.includes('california') || norm.includes('texas') ||
        norm.includes('canada') || norm.includes('sydney') || norm.includes('toronto') || 
        norm.includes('australia')) {
      return false;
    }
    if (knownTurkish.some(t => t.toLowerCase() === norm)) return true;
    if (turkishKeywords.some(kw => norm.includes(kw))) return true;
    return false;
  }

  const nonTurkishIds = rows.filter(r => !isTurkish(r.name)).map(r => r.id);
  console.log('Total non-Turkish rows to delete:', nonTurkishIds.length);

  const sql = "-- Run this in your Supabase SQL Editor to delete non-Turkish universities\nDELETE FROM universities WHERE id IN ('" + nonTurkishIds.join("','") + "');\n";
  fs.writeFileSync('cleanup_universities.sql', sql);
  console.log('SQL generated: cleanup_universities.sql');
}
run();
