#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const { Command } = require('commander');

const REGEXES_PATH = path.resolve(__dirname, '../../regexes');

/**
 * @typedef FileWithContent
 * @property {string} path
 * @property {string} content
 */

/**
 * @param {string} yamlPath 
 * @returns {FileWithContent}
 */
const generateCommonJs = (yamlPath) => {
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const jsData = YAML.load(yamlContent);
  const jsFilePath = yamlPath.replace(/\.ya?ml$/, '.js');
  const jsFileContent = `module.exports = ${JSON.stringify(jsData, null, 2)};\n`;
  return { path: jsFilePath, content: jsFileContent };
};

/**
 * @param {string} directoryPath 
 * @returns {FileWithContent[]}
 */
const generateDirectoryCommonJs = (directoryPath) => {
  const files = fs.readdirSync(directoryPath);
  const result = [];
  files.forEach((file) => {
    const absolutePath = path.join(directoryPath, file);
    const isDirectory = fs.statSync(absolutePath).isDirectory();
    const isYaml = path.extname(absolutePath) === '.yaml' || path.extname(absolutePath) === '.yml';
    if (isDirectory) {
      const results = generateDirectoryCommonJs(absolutePath);
      result.push(...results);
    } else if (isYaml) {
      const file = generateCommonJs(absolutePath);
      result.push(file);
    }
  });
  return result;
};

const program = new Command();
program.description(`==========================================================
  This script generates CommonJS modules from YAML files.
  Usages:
  $> node generate-regexes-commonjs.js
==========================================================`);
program.action(() => {
  const files = generateDirectoryCommonJs(REGEXES_PATH);
  files.forEach((file) => {
    fs.writeFileSync(file.path, file.content, 'utf8');
  });
});
program.parse(process.argv);
