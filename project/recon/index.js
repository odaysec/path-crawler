#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const regex = /\/[a-zA-Z0-9_\-\/.]+(?=["'\\])/g;
const results = new Set();

async function fetchAndExtract(inputURL) {
    try {
        const baseURL = new URL(inputURL);
        const domain = baseURL.hostname;
        const outputDir = path.join(__dirname, 'results', domain);

        // Buat folder output jika belum ada
        fs.mkdirSync(outputDir, { recursive: true });

        const res = await axios.get(inputURL);
        const html = res.data;
        const $ = cheerio.load(html);

        // Extract dari HTML utama
        const matches = html.matchAll(regex);
        for (const match of matches) results.add(match[0]);

        // Extract dari linked script/href
        const elements = $('script[src], link[href]');
        const resources = new Set();

        elements.each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('href');
            if (src) {
                try {
                    const fullUrl = new URL(src, baseURL.href).href;
                    resources.add(fullUrl);
                } catch (e) {
                    // skip jika URL gak valid
                }
            }
        });

        for (const resource of resources) {
            try {
                const r = await axios.get(resource);
                const rMatches = r.data.matchAll(regex);
                for (const match of rMatches) results.add(match[0]);
            } catch (e) {
                console.warn(`⚠️ Gagal fetch: ${resource}`);
            }
        }

        // Simpan hasil ke file
        const sortedResults = Array.from(results).sort().join('\n');
        const outputPath = path.join(outputDir, 'directory_list.txt');
        fs.writeFileSync(outputPath, sortedResults, 'utf-8');

        console.log(`✅ Direktori berhasil disimpan di: ${outputPath}`);
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
