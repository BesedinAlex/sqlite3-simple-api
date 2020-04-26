import * as path from 'path';
import * as fs from 'fs-extra';

fs.removeSync(path.join(process.cwd(), 'data'));
