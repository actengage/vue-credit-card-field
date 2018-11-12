// import fs from 'fs';
import { SRC } from './paths';

export default {
    watch: SRC,
    port: 35730,
    /*
    https: {
        key: fs.readFileSync('./livereload.key'),
        cert: fs.readFileSync('./livereload.crt'),
        ca: fs.readFileSync("./livereload.pem")
    }
    */
};
