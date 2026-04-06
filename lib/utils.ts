import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function getCountryFlag(nationality: string): string {
  const flagMap: Record<string, string> = {
    'Afghanistan': 'https://flagcdn.com/w40/af.png',
    'Albania': 'https://flagcdn.com/w40/al.png',
    'Algeria': 'https://flagcdn.com/w40/dz.png',
    'Andorra': 'https://flagcdn.com/w40/ad.png',
    'Angola': 'https://flagcdn.com/w40/ao.png',
    'Antigua and Barbuda': 'https://flagcdn.com/w40/ag.png',
    'Argentina': 'https://flagcdn.com/w40/ar.png',
    'Armenia': 'https://flagcdn.com/w40/am.png',
    'Australia': 'https://flagcdn.com/w40/au.png',
    'Austria': 'https://flagcdn.com/w40/at.png',
    'Azerbaijan': 'https://flagcdn.com/w40/az.png',
    'Bahamas': 'https://flagcdn.com/w40/bs.png',
    'Bahrain': 'https://flagcdn.com/w40/bh.png',
    'Bangladesh': 'https://flagcdn.com/w40/bd.png',
    'Barbados': 'https://flagcdn.com/w40/bb.png',
    'Belarus': 'https://flagcdn.com/w40/by.png',
    'Belgium': 'https://flagcdn.com/w40/be.png',
    'Belize': 'https://flagcdn.com/w40/bz.png',
    'Benin': 'https://flagcdn.com/w40/bj.png',
    'Bhutan': 'https://flagcdn.com/w40/bt.png',
    'Bolivia': 'https://flagcdn.com/w40/bo.png',
    'Bosnia and Herzegovina': 'https://flagcdn.com/w40/ba.png',
    'Botswana': 'https://flagcdn.com/w40/bw.png',
    'Brazil': 'https://flagcdn.com/w40/br.png',
    'Brunei': 'https://flagcdn.com/w40/bn.png',
    'Bulgaria': 'https://flagcdn.com/w40/bg.png',
    'Burkina Faso': 'https://flagcdn.com/w40/bf.png',
    'Burundi': 'https://flagcdn.com/w40/bi.png',
    'Cambodia': 'https://flagcdn.com/w40/kh.png',
    'Cameroon': 'https://flagcdn.com/w40/cm.png',
    'Canada': 'https://flagcdn.com/w40/ca.png',
    'Cape Verde': 'https://flagcdn.com/w40/cv.png',
    'Central African Republic': 'https://flagcdn.com/w40/cf.png',
    'Chad': 'https://flagcdn.com/w40/td.png',
    'Chile': 'https://flagcdn.com/w40/cl.png',
    'China': 'https://flagcdn.com/w40/cn.png',
    'Colombia': 'https://flagcdn.com/w40/co.png',
    'Comoros': 'https://flagcdn.com/w40/km.png',
    'Congo': 'https://flagcdn.com/w40/cg.png',
    'Costa Rica': 'https://flagcdn.com/w40/cr.png',
    'Croatia': 'https://flagcdn.com/w40/hr.png',
    'Cuba': 'https://flagcdn.com/w40/cu.png',
    'Cyprus': 'https://flagcdn.com/w40/cy.png',
    'Czech Republic': 'https://flagcdn.com/w40/cz.png',
    'Denmark': 'https://flagcdn.com/w40/dk.png',
    'Djibouti': 'https://flagcdn.com/w40/dj.png',
    'Dominica': 'https://flagcdn.com/w40/dm.png',
    'Dominican Republic': 'https://flagcdn.com/w40/do.png',
    'Ecuador': 'https://flagcdn.com/w40/ec.png',
    'Egypt': 'https://flagcdn.com/w40/eg.png',
    'El Salvador': 'https://flagcdn.com/w40/sv.png',
    'England': 'https://flagcdn.com/w40/gb-eng.png',
    'Equatorial Guinea': 'https://flagcdn.com/w40/gq.png',
    'Eritrea': 'https://flagcdn.com/w40/er.png',
    'Estonia': 'https://flagcdn.com/w40/ee.png',
    'Eswatini': 'https://flagcdn.com/w40/sz.png',
    'Ethiopia': 'https://flagcdn.com/w40/et.png',
    'Fiji': 'https://flagcdn.com/w40/fj.png',
    'Finland': 'https://flagcdn.com/w40/fi.png',
    'France': 'https://flagcdn.com/w40/fr.png',
    'Gabon': 'https://flagcdn.com/w40/ga.png',
    'Gambia': 'https://flagcdn.com/w40/gm.png',
    'Georgia': 'https://flagcdn.com/w40/ge.png',
    'Germany': 'https://flagcdn.com/w40/de.png',
    'Ghana': 'https://flagcdn.com/w40/gh.png',
    'Greece': 'https://flagcdn.com/w40/gr.png',
    'Grenada': 'https://flagcdn.com/w40/gd.png',
    'Guatemala': 'https://flagcdn.com/w40/gt.png',
    'Guinea': 'https://flagcdn.com/w40/gn.png',
    'Guinea-Bissau': 'https://flagcdn.com/w40/gw.png',
    'Guyana': 'https://flagcdn.com/w40/gy.png',
    'Haiti': 'https://flagcdn.com/w40/ht.png',
    'Honduras': 'https://flagcdn.com/w40/hn.png',
    'Hungary': 'https://flagcdn.com/w40/hu.png',
    'Iceland': 'https://flagcdn.com/w40/is.png',
    'India': 'https://flagcdn.com/w40/in.png',
    'Indonesia': 'https://flagcdn.com/w40/id.png',
    'Iran': 'https://flagcdn.com/w40/ir.png',
    'Iraq': 'https://flagcdn.com/w40/iq.png',
    'Ireland': 'https://flagcdn.com/w40/ie.png',
    'Israel': 'https://flagcdn.com/w40/il.png',
    'Italy': 'https://flagcdn.com/w40/it.png',
    'Jamaica': 'https://flagcdn.com/w40/jm.png',
    'Japan': 'https://flagcdn.com/w40/jp.png',
    'Jordan': 'https://flagcdn.com/w40/jo.png',
    'Kazakhstan': 'https://flagcdn.com/w40/kz.png',
    'Kenya': 'https://flagcdn.com/w40/ke.png',
    'Kiribati': 'https://flagcdn.com/w40/ki.png',
    'Kuwait': 'https://flagcdn.com/w40/kw.png',
    'Kyrgyzstan': 'https://flagcdn.com/w40/kg.png',
    'Laos': 'https://flagcdn.com/w40/la.png',
    'Latvia': 'https://flagcdn.com/w40/lv.png',
    'Lebanon': 'https://flagcdn.com/w40/lb.png',
    'Lesotho': 'https://flagcdn.com/w40/ls.png',
    'Liberia': 'https://flagcdn.com/w40/lr.png',
    'Libya': 'https://flagcdn.com/w40/ly.png',
    'Liechtenstein': 'https://flagcdn.com/w40/li.png',
    'Lithuania': 'https://flagcdn.com/w40/lt.png',
    'Luxembourg': 'https://flagcdn.com/w40/lu.png',
    'Madagascar': 'https://flagcdn.com/w40/mg.png',
    'Malawi': 'https://flagcdn.com/w40/mw.png',
    'Malaysia': 'https://flagcdn.com/w40/my.png',
    'Maldives': 'https://flagcdn.com/w40/mv.png',
    'Mali': 'https://flagcdn.com/w40/ml.png',
    'Malta': 'https://flagcdn.com/w40/mt.png',
    'Marshall Islands': 'https://flagcdn.com/w40/mh.png',
    'Mauritania': 'https://flagcdn.com/w40/mr.png',
    'Mauritius': 'https://flagcdn.com/w40/mu.png',
    'Mexico': 'https://flagcdn.com/w40/mx.png',
    'Micronesia': 'https://flagcdn.com/w40/fm.png',
    'Moldova': 'https://flagcdn.com/w40/md.png',
    'Monaco': 'https://flagcdn.com/w40/mc.png',
    'Mongolia': 'https://flagcdn.com/w40/mn.png',
    'Montenegro': 'https://flagcdn.com/w40/me.png',
    'Morocco': 'https://flagcdn.com/w40/ma.png',
    'Mozambique': 'https://flagcdn.com/w40/mz.png',
    'Myanmar': 'https://flagcdn.com/w40/mm.png',
    'Namibia': 'https://flagcdn.com/w40/na.png',
    'Nauru': 'https://flagcdn.com/w40/nr.png',
    'Nepal': 'https://flagcdn.com/w40/np.png',
    'Netherlands': 'https://flagcdn.com/w40/nl.png',
    'New Zealand': 'https://flagcdn.com/w40/nz.png',
    'Nicaragua': 'https://flagcdn.com/w40/ni.png',
    'Niger': 'https://flagcdn.com/w40/ne.png',
    'Nigeria': 'https://flagcdn.com/w40/ng.png',
    'North Korea': 'https://flagcdn.com/w40/kp.png',
    'North Macedonia': 'https://flagcdn.com/w40/mk.png',
    'Northern Ireland': 'https://flagcdn.com/w40/gb-nir.png',
    'Norway': 'https://flagcdn.com/w40/no.png',
    'Oman': 'https://flagcdn.com/w40/om.png',
    'Pakistan': 'https://flagcdn.com/w40/pk.png',
    'Palau': 'https://flagcdn.com/w40/pw.png',
    'Palestine': 'https://flagcdn.com/w40/ps.png',
    'Panama': 'https://flagcdn.com/w40/pa.png',
    'Papua New Guinea': 'https://flagcdn.com/w40/pg.png',
    'Paraguay': 'https://flagcdn.com/w40/py.png',
    'Peru': 'https://flagcdn.com/w40/pe.png',
    'Philippines': 'https://flagcdn.com/w40/ph.png',
    'Poland': 'https://flagcdn.com/w40/pl.png',
    'Portugal': 'https://flagcdn.com/w40/pt.png',
    'Qatar': 'https://flagcdn.com/w40/qa.png',
    'Romania': 'https://flagcdn.com/w40/ro.png',
    'Russia': 'https://flagcdn.com/w40/ru.png',
    'Rwanda': 'https://flagcdn.com/w40/rw.png',
    'Saint Kitts and Nevis': 'https://flagcdn.com/w40/kn.png',
    'Saint Lucia': 'https://flagcdn.com/w40/lc.png',
    'Saint Vincent and the Grenadines': 'https://flagcdn.com/w40/vc.png',
    'Samoa': 'https://flagcdn.com/w40/ws.png',
    'San Marino': 'https://flagcdn.com/w40/sm.png',
    'Sao Tome and Principe': 'https://flagcdn.com/w40/st.png',
    'Saudi Arabia': 'https://flagcdn.com/w40/sa.png',
    'Scotland': 'https://flagcdn.com/w40/gb-sct.png',
    'Senegal': 'https://flagcdn.com/w40/sn.png',
    'Serbia': 'https://flagcdn.com/w40/rs.png',
    'Seychelles': 'https://flagcdn.com/w40/sc.png',
    'Sierra Leone': 'https://flagcdn.com/w40/sl.png',
    'Singapore': 'https://flagcdn.com/w40/sg.png',
    'Slovakia': 'https://flagcdn.com/w40/sk.png',
    'Slovenia': 'https://flagcdn.com/w40/si.png',
    'Solomon Islands': 'https://flagcdn.com/w40/sb.png',
    'Somalia': 'https://flagcdn.com/w40/so.png',
    'South Africa': 'https://flagcdn.com/w40/za.png',
    'South Korea': 'https://flagcdn.com/w40/kr.png',
    'South Sudan': 'https://flagcdn.com/w40/ss.png',
    'Spain': 'https://flagcdn.com/w40/es.png',
    'Sri Lanka': 'https://flagcdn.com/w40/lk.png',
    'Sudan': 'https://flagcdn.com/w40/sd.png',
    'Suriname': 'https://flagcdn.com/w40/sr.png',
    'Sweden': 'https://flagcdn.com/w40/se.png',
    'Switzerland': 'https://flagcdn.com/w40/ch.png',
    'Syria': 'https://flagcdn.com/w40/sy.png',
    'Taiwan': 'https://flagcdn.com/w40/tw.png',
    'Tajikistan': 'https://flagcdn.com/w40/tj.png',
    'Tanzania': 'https://flagcdn.com/w40/tz.png',
    'Thailand': 'https://flagcdn.com/w40/th.png',
    'Timor-Leste': 'https://flagcdn.com/w40/tl.png',
    'Togo': 'https://flagcdn.com/w40/tg.png',
    'Tonga': 'https://flagcdn.com/w40/to.png',
    'Trinidad and Tobago': 'https://flagcdn.com/w40/tt.png',
    'Tunisia': 'https://flagcdn.com/w40/tn.png',
    'Turkey': 'https://flagcdn.com/w40/tr.png',
    'Turkmenistan': 'https://flagcdn.com/w40/tm.png',
    'Tuvalu': 'https://flagcdn.com/w40/tv.png',
    'Uganda': 'https://flagcdn.com/w40/ug.png',
    'Ukraine': 'https://flagcdn.com/w40/ua.png',
    'United Arab Emirates': 'https://flagcdn.com/w40/ae.png',
    'United States': 'https://flagcdn.com/w40/us.png',
    'Uruguay': 'https://flagcdn.com/w40/uy.png',
    'Uzbekistan': 'https://flagcdn.com/w40/uz.png',
    'Vanuatu': 'https://flagcdn.com/w40/vu.png',
    'Vatican City': 'https://flagcdn.com/w40/va.png',
    'Venezuela': 'https://flagcdn.com/w40/ve.png',
    'Vietnam': 'https://flagcdn.com/w40/vn.png',
    'Wales': 'https://flagcdn.com/w40/gb-wls.png',
    'Yemen': 'https://flagcdn.com/w40/ye.png',
    'Zambia': 'https://flagcdn.com/w40/zm.png',
    'Zimbabwe': 'https://flagcdn.com/w40/zw.png',
    'Other': 'https://flagcdn.com/w40/un.png',
  };

  return flagMap[nationality] || 'https://flagcdn.com/w40/un.png';
}

export function calculatePlayerRating(stats: {
  goals: number;
  assists: number;
  minutesPlayed: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
}): number {
  // Handle edge case: no matches played
  if (stats.matchesPlayed === 0) {
    return 5; // Average rating
  }

  // Start with baseline rating
  let rating = 5;

  // Goals and assists reward impact
  const goalsPerGame = stats.goals / stats.matchesPlayed;
  rating += goalsPerGame * 1.8;

  const assistsPerGame = stats.assists / stats.matchesPlayed;
  rating += assistsPerGame * 1.2;

  // Minutes consistency gives a stable baseline for regular contributors
  const minutesPerGame = stats.minutesPlayed / stats.matchesPlayed;
  rating += Math.min((minutesPerGame / 90) * 1.5, 1.5);

  // Reward consistent selection across the season
  rating += Math.min(stats.matchesPlayed * 0.04, 0.8);

  // Card discipline penalty
  // Yellow card: -0.25 per card
  // Red card: -0.6 per card
  const cardPenalty = stats.yellowCards * 0.25 + stats.redCards * 0.6;
  rating -= cardPenalty;

  // Clamp rating between 0 and 10
  return Math.max(0, Math.min(10, rating));
}

export function getRatingColor(rating: number): string {
  if (rating >= 8.5) return 'text-blue-600';
  if (rating >= 7) return 'text-green-600';
  if (rating >= 5) return 'text-orange-600';
  return 'text-red-600';
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 8.5) return 'bg-blue-100';
  if (rating >= 7) return 'bg-green-100';
  if (rating >= 5) return 'bg-orange-100';
  return 'bg-red-100';
}

export function calculatePerGameRating(matchStats: {
  goals?: number;
  assists?: number;
  minutesPlayed?: number;
  yellowCards?: number;
  redCards?: number;
}): string {
  // If player didn't play in this match, return "--"
  if (!matchStats || matchStats.minutesPlayed === 0) {
    return '--';
  }

  // Start with 6.0 for an average match
  let rating = 6.0;

  // Goals contribution: +1.2 per goal
  if (matchStats.goals) {
    rating += matchStats.goals * 1.2;
  }

  // Assists contribution: +0.8 per assist
  if (matchStats.assists) {
    rating += matchStats.assists * 0.8;
  }

  // Minutes bonus: up to +1.5 for 90 minutes
  if (matchStats.minutesPlayed) {
    const minuteBonus = Math.min((matchStats.minutesPlayed / 90) * 1.5, 1.5);
    rating += minuteBonus;
  }

  // Card penalties: -0.25 per yellow, -0.6 per red
  if (matchStats.yellowCards) {
    rating -= matchStats.yellowCards * 0.25;
  }
  if (matchStats.redCards) {
    rating -= matchStats.redCards * 0.6;
  }

  // Clamp rating between 0 and 10
  rating = Math.max(0, Math.min(10, rating));

  return rating.toFixed(1);
}
