import { Compiler } from 'webpack';
import * as fs from 'fs';

type InputOptions = {
    templatePath: string,
    pathToSave: string
    excludes?: Array<string>
}

class ModuleLogger {

    private fsNames: Set<string>;
    private pathToSave: string;
    constructor({ templatePath, pathToSave, excludes }: InputOptions) {
        this.pathToSave = pathToSave;
        this.fsNames = new Set();
        this.getPathsAllFiles(templatePath, excludes);
    }
    apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('ModuleLogger', (stats) => {
            stats.compilation.modules.forEach(module => {
                //@ts-ignore
                    const modulePath = module.resource;
                if (typeof modulePath === 'string') {
                    this.fsNames.delete(modulePath);
                }
            });

            fs.writeFileSync(this.pathToSave, JSON.stringify(Array.from(this.fsNames)));
        });
    }

    getPathsAllFiles(path: string, excludes?: Array<string>) {
        const files = fs.readdirSync(path);
        for (const file of files) {
            const pathOfFile = `${path}/${file}`;
            const isDirectory = fs.lstatSync(pathOfFile).isDirectory();
            if (isDirectory) {
                this.getPathsAllFiles(pathOfFile, excludes);
            } else {
                if (excludes.indexOf(pathOfFile) === -1) {
                    this.fsNames.add(pathOfFile);
                }
            }
        }
    }
}

export default ModuleLogger;