#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const regex = /\/[a-zA-Z0-9_\-\/.]+(?=["'\\])/g;
const results = new Set();

async function fetchAndExtract(url) {
    try {
        const res = await axios.get(url);
        const html = res.data;
        const $ = cheerio.load(html);

        // Extract from main HTML
        const matches = html.matchAll(regex);
        for (const match of matches) results.add(match[0]);

        // Extract from linked resources
        const elements = $('script[src], link[href]');
        const resources = new Set();

        elements.each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('href');
            if (src && !src.startsWith('http')) {
                resources.add(new URL(src, url).href);
            } else if (src) {
                resources.add(src);
            }
        });

        for (const resource of resources) {
            try {
                const r = await axios.get(resource);
                const rMatches = r.data.matchAll(regex);
                for (const match of rMatches) results.add(match[0]);
            } catch (e) {
                console.warn(`Gagal fetch: ${resource}`);
            }
        }

        // Save to file
        const sortedResults = Array.from(results).sort().join('\n');
        fs.writeFileSync('directory_list.txt', sortedResults, 'utf-8');
        console.log('✅ Direktori berhasil disimpan di: directory_list.txt');
    } catch (err) {
        console.error('❌ Gagal mengakses URL:', err.message);
    }
}

// CLI Entry
const inputURL = process.argv[2];
if (!inputURL) {
    console.error('❗ Contoh pemakaian: pathcrawler https://example.com');
    process.exit(1);
}

fetchAndExtract(inputURL);
