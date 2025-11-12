'use strict';

window.addEventListener('DOMContentLoaded', feeds);

async function feeds() {
    const feeds = [
        {
            feed: 'Guides',
            url: 'https://raw.githubusercontent.com/aaron-watts/aaron-watts.github.io/refs/heads/main/docs/guides/feed.xml',
        },
        {
            feed: 'Tech',
            url: 'https://raw.githubusercontent.com/aaron-watts/aaron-watts.github.io/refs/heads/main/docs/tech/feed.xml',
        },
        {
            feed: 'Blog',
            url: 'https://raw.githubusercontent.com/aaron-watts/blog.aaronwatts.dev/refs/heads/main/feed.xml'
        }
    ];

    const nav = document.querySelector('nav');
    const h2 = document.createElement('h2');
    h2.innerText = 'Latest Articles:';
    nav.appendChild(h2);
    
    await feeds.forEach(async function(feed) {
        const rssText = await fetchFeed(feed.url);
        
        const xmlDoc = parseFeed(rssText);

        const feedType = xmlDoc.children[0].tagName;

        const entry = {};
        if (feedType == 'rss') {
            const latest = xmlDoc.getElementsByTagName('item')[0];
            entry.title = latest.getElementsByTagName('title')[0].textContent;
            entry.link = latest.getElementsByTagName('link')[0].textContent;
            entry.date = latest.getElementsByTagName('pubDate')[0].textContent;
            entry.desc = latest.getElementsByTagName('description')[0].textContent;
        }
        else if (feedType == 'feed') {
            const latest = xmlDoc.getElementsByTagName('entry')[0];
            entry.title = latest.getElementsByTagName('title')[0].textContent;
            entry.link = latest.getElementsByTagName('link')[0].attributes.href.textContent;
            entry.date = latest.getElementsByTagName('updated')[0].textContent;
            entry.desc = latest.getElementsByTagName('summary')[0].textContent;
        }
        
        feed.entry = entry;

        populateContent(feed, nav);
    })
}

function populateContent(entry, wrapper) {
    const article = document.createElement('article');
    article.setAttribute('aria-label', `${entry.feed} Latest`);
    const header = document.createElement('header');
    const h3 = document.createElement('h3');
    h3.innerText = entry.entry.title;
    header.appendChild(h3);
    const linkP = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', entry.entry.link);
    link.innerText = entry.entry.link;
    linkP.appendChild(link);
    header.appendChild(linkP);
    article.appendChild(header);
    const summary = document.createElement('p');
    summary.innerHTML = entry.entry.desc;
    article.appendChild(summary);
    wrapper.appendChild(article);
}

function parseFeed(rssText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, 'text/xml');
    return xmlDoc;
}

async function fetchFeed(url) {
    try {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        const rssText = await res.text();
        return rssText;
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}
