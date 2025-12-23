// ---- Imports ----------------------------------------------------------------
import merge from 'lodash.merge';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

// ---- Setup ------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceFilePath = path.resolve(__dirname, 'service.yaml');
const serviceConfigFile = fs.readFileSync(serviceFilePath, 'utf8');
const commonFilePath = path.resolve(__dirname, '../../../sls.d/common.yaml');
const commonConfigFile = fs.readFileSync(commonFilePath, 'utf8');

const serviceConfig = YAML.parseDocument(serviceConfigFile, { prettyErrors: true }).toJS();
const commonConfig = YAML.parseDocument(commonConfigFile, { prettyErrors: true }).toJS();
const slsConfig = merge(commonConfig, serviceConfig);

export default slsConfig;
