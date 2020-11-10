import fs from 'fs';
import execute from '@getvim/execute';
import { homedir } from 'os';
import path from 'path';

const exec = execute.execute;

const iconSets = {
    gps: [
        /^weather-/,
        /^satellite-/,
        /^crosshairs-/,
    ],
    rainfallrecord: [
        /^weather-pouring$/,
        /^export-variant$/,
        /^dots-vertical$/,
        /^map-marker$/,
    ],
};

const icons = iconSets.rainfallrecord;

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

async function build() {
    if (fs.existsSync('./svg')) {
        await exec(`mv "./svg" "./svg-${Date.now()}"`);
    }

    await exec(`mkdir "./svg"`);

    const mdiDir = path.join('.', 'MaterialDesign');

    const meta = JSON.parse(
        fs.readFileSync(
            path.join(mdiDir, 'meta.json')
        )
    ).filter(
        i => icons.reduce((acc, b) => acc || b.test(i.name), false)
    );

    for (const i of meta.map(i => i.name)) {
        console.log(i);
        const filepath = path.join(mdiDir, 'svg', i) + '.svg';
        console.log(' =>', filepath);
        await exec(`cp "${filepath}" "./svg/"`);
        fs.copyFileSync(filepath, path.join('.', 'svg', i) + '.svg');
    }

    fs.writeFileSync('meta.json', JSON.stringify(meta, null, 1));
    fs.copyFileSync(path.join(mdiDir, 'font-build.json'), path.join('.', 'font-build.json'));

    return meta.length;
}

build().then(console.log);
