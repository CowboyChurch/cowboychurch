
async function loadJSON(path){
  const response = await fetch(path, { cache: 'no-store' });
  if(!response.ok) throw new Error('Unable to load ' + path);
  return response.json();
}
function formatDate(value){
  if(!value) return '';
  const d = new Date(value + 'T12:00:00');
  if(Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
}
function eventCard(event){
  const date = formatDate(event.date);
  const recurring = event.recurring ? `<p class="small"><b>Repeats:</b> ${event.recurring}</p>` : '';
  return `<div class="moment"><strong>${date}<br>${event.time || ''}</strong><span><b>${event.title || ''}</b><br>${event.description || ''}${event.location ? `<br><span class="small">${event.location}</span>` : ''}${recurring}</span></div>`;
}
function storyCard(story){
  const img = story.image ? `<img src="${story.image}" alt="${story.title || 'Cowboy Church story'}">` : '';
  return `<article class="card">${img}<div><h3>${story.title || ''}</h3><p>${story.summary || story.body || ''}</p></div></article>`;
}
async function renderEvents(targetId, featuredOnly=false){
  const target=document.getElementById(targetId); if(!target) return;
  try{
    const data=await loadJSON('content/events.json');
    let events=(data.events||[]).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    if(featuredOnly) events=events.filter(e=>e.featured);
    target.innerHTML=events.length ? events.map(eventCard).join('') : '<p class="lead">Calendar updates will appear here as they are added through the church admin portal.</p>';
  }catch(e){ target.innerHTML='<p class="lead">Calendar updates will appear here once published.</p>'; }
}
async function renderStories(targetId){
  const target=document.getElementById(targetId); if(!target) return;
  try{
    const data=await loadJSON('content/stories.json');
    const stories=(data.stories||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    target.innerHTML=stories.length ? stories.map(storyCard).join('') : '<p class="lead">Stories and photos will appear here as they are added through the church admin portal.</p>';
  }catch(e){ target.innerHTML='<p class="lead">Stories and photos will appear here once published.</p>'; }
}
