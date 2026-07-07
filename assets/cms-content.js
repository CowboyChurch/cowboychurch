
async function loadJSON(path){
  const response = await fetch(path, { cache: 'no-store' });
  if(!response.ok) throw new Error('Unable to load ' + path);
  return response.json();
}
function escapeHTML(value){
  return String(value || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function formatDate(value){
  if(!value) return '';
  const d = new Date(value + 'T12:00:00');
  if(Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
}
function eventCard(event){
  const date = formatDate(event.date);
  const recurring = event.recurring && event.recurring !== 'One-time Event' ? `<p class="small"><b>Repeats:</b> ${escapeHTML(event.recurring)}${event.recurring_details ? ` — ${escapeHTML(event.recurring_details)}` : ''}</p>` : '';
  return `<div class="moment"><strong>${escapeHTML(date)}<br>${escapeHTML(event.time || '')}</strong><span><b>${escapeHTML(event.title || '')}</b><br>${escapeHTML(event.description || '')}${event.location ? `<br><span class="small">${escapeHTML(event.location)}</span>` : ''}${recurring}</span></div>`;
}
function storyCard(story){
  const img = story.image ? `<img class="cms-story-image" src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title || 'Cowboy Church story')}">` : '';
  const category = story.category ? `<p class="small"><b>${escapeHTML(story.category)}</b></p>` : '';
  return `<article class="card">${img}<div><h3>${escapeHTML(story.title || '')}</h3>${category}<p>${escapeHTML(story.summary || story.body || '')}</p></div></article>`;
}
async function renderEvents(targetId, featuredOnly=false){
  const target=document.getElementById(targetId); if(!target) return;
  try{
    const data=await loadJSON('content/events.json');
    let events=(data.events||[]).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    if(featuredOnly) events=events.filter(e=>e.featured);
    target.innerHTML=events.length ? events.map(eventCard).join('') : '<p class="lead">Current and upcoming events will appear here as they are published through the church calendar.</p>';
  }catch(e){ target.innerHTML='<p class="lead">Calendar updates will appear here once published.</p>'; }
}
async function renderStories(targetId){
  const target=document.getElementById(targetId); if(!target) return;
  try{
    const data=await loadJSON('content/stories.json');
    const stories=(data.stories||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    target.innerHTML=stories.length ? stories.map(storyCard).join('') : '<p class="lead">Stories, testimonies, photos, and ministry highlights will appear here as they are published.</p>';
  }catch(e){ target.innerHTML='<p class="lead">Stories and photos will appear here once published.</p>'; }
}
