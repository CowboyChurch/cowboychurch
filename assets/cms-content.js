async function loadJSON(path){
  const response = await fetch(path, { cache: 'no-store' });
  if(!response.ok) throw new Error('Unable to load ' + path);
  return response.json();
}
<<<<<<< HEAD

=======
function escapeHTML(value){
  return String(value || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
>>>>>>> 2ec99ecabd5ffb8b6d78e824927f2d1b64535fd0
function formatDate(value){
  if(!value) return '';
  const d = new Date(value + 'T12:00:00');
  if(Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined,{
    weekday:'short',
    month:'short',
    day:'numeric',
    year:'numeric'
  });
}

function eventCard(event){
  const date = formatDate(event.date);
<<<<<<< HEAD
  const recurring = event.recurring
    ? `<p class="small"><b>Repeats:</b> ${event.recurring}</p>`
    : '';

  return `
    <div class="moment">
      <strong>${date}<br>${event.time || ''}</strong>
      <span>
        <b>${event.title || ''}</b><br>
        ${event.description || ''}
        ${event.location ? `<br><span class="small">${event.location}</span>` : ''}
        ${recurring}
      </span>
    </div>
  `;
=======
  const recurring = event.recurring && event.recurring !== 'One-time Event' ? `<p class="small"><b>Repeats:</b> ${escapeHTML(event.recurring)}${event.recurring_details ? ` — ${escapeHTML(event.recurring_details)}` : ''}</p>` : '';
  return `<div class="moment"><strong>${escapeHTML(date)}<br>${escapeHTML(event.time || '')}</strong><span><b>${escapeHTML(event.title || '')}</b><br>${escapeHTML(event.description || '')}${event.location ? `<br><span class="small">${escapeHTML(event.location)}</span>` : ''}${recurring}</span></div>`;
>>>>>>> 2ec99ecabd5ffb8b6d78e824927f2d1b64535fd0
}

function storyCard(story){
<<<<<<< HEAD
  const img = story.image
    ? `<img src="${story.image}" alt="${story.title || 'Cowboy Church story'}">`
    : '';

  return `
    <article class="card">
      ${img}
      <div>
        <h3>${story.title || ''}</h3>
        <p>${story.summary || story.body || ''}</p>
      </div>
    </article>
  `;
=======
  const img = story.image ? `<img class="cms-story-image" src="${escapeHTML(story.image)}" alt="${escapeHTML(story.title || 'Cowboy Church story')}">` : '';
  const category = story.category ? `<p class="small"><b>${escapeHTML(story.category)}</b></p>` : '';
  return `<article class="card">${img}<div><h3>${escapeHTML(story.title || '')}</h3>${category}<p>${escapeHTML(story.summary || story.body || '')}</p></div></article>`;
>>>>>>> 2ec99ecabd5ffb8b6d78e824927f2d1b64535fd0
}

async function renderEvents(targetId, featuredOnly = false){
  const target = document.getElementById(targetId);
  if(!target) return;

  try{
<<<<<<< HEAD
    const data = await loadJSON('content/events.json');

    let events = (data.events || [])
      .slice()
      .sort((a,b)=>(a.date || '').localeCompare(b.date || ''));

    if(featuredOnly){
      events = events.filter(e => e.featured);
    }

    target.innerHTML = events.length
      ? events.map(eventCard).join('')
      : `<p class="lead">
          No upcoming events are scheduled at this time.
          Please check back soon for new opportunities to worship,
          serve, and connect.
        </p>`;
  }
  catch(e){
    target.innerHTML = `
      <p class="lead">
        No upcoming events are scheduled at this time.
        Please check back soon.
      </p>
    `;
  }
=======
    const data=await loadJSON('content/events.json');
    let events=(data.events||[]).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    if(featuredOnly) events=events.filter(e=>e.featured);
    target.innerHTML=events.length ? events.map(eventCard).join('') : '<p class="lead">Current and upcoming events will appear here as they are published through the church calendar.</p>';
  }catch(e){ target.innerHTML='<p class="lead">Calendar updates will appear here once published.</p>'; }
>>>>>>> 2ec99ecabd5ffb8b6d78e824927f2d1b64535fd0
}

async function renderStories(targetId){
  const target = document.getElementById(targetId);
  if(!target) return;

  try{
<<<<<<< HEAD
    const data = await loadJSON('content/stories.json');

    const stories = (data.stories || [])
      .slice()
      .sort((a,b)=>(b.date || '').localeCompare(a.date || ''));

    target.innerHTML = stories.length
      ? stories.map(storyCard).join('')
      : `<p class="lead">
          New stories, testimonies, and photos will appear here as they
          are shared. Check back often to see what God is doing through
          Cowboy Church.
        </p>`;
  }
  catch(e){
    target.innerHTML = `
      <p class="lead">
        No stories have been published yet.
        Please check back soon.
      </p>
    `;
  }
}
=======
    const data=await loadJSON('content/stories.json');
    const stories=(data.stories||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    target.innerHTML=stories.length ? stories.map(storyCard).join('') : '<p class="lead">Stories, testimonies, photos, and ministry highlights will appear here as they are published.</p>';
  }catch(e){ target.innerHTML='<p class="lead">Stories and photos will appear here once published.</p>'; }
}
>>>>>>> 2ec99ecabd5ffb8b6d78e824927f2d1b64535fd0
