import fs from 'fs';
import test from 'tape';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import mask from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

let fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        geojson: load.sync(path.join(directories.in, filename))
    };
});

test('turf-mask', t => {
    for (const {name, filename, geojson} of fixtures) {
        let masking, polygon

        if (geojson.features.length > 2) {
          polygon = geojson
          masking = geojson.features.pop()
        } else {
          polygon = geojson.features[0]
          masking = geojson.features[1]
        }

        // const 
        const results = mask(polygon, masking);

        if (process.env.REGEN) write.sync(directories.out + filename, results);
        t.deepEquals(results, load.sync(directories.out + filename), name);
    }
    t.end();
});
