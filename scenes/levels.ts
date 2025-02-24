import Level from './level';
import * as constant from './constant';

const levels = [];

for (let i = 1; i <= constant.commands.length; i++) {
    levels.push(new Level(i, constant.commands[i-1]));
}

export default levels;
