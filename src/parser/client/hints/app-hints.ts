
import {AbstractParser} from '../../abstract-parser';
import { ResultClientHints } from '../../../client-hints';

export class AppHints extends AbstractParser
{
  constructor() {
    super();
    this.fixtureFile = 'client/hints/apps.yml';
    this.loadCollection();
  }

  parse(clientHints: ResultClientHints) {
    let appId = clientHints.app;
    if (!appId) {
      return null;
    }
    if (this.collection[appId] === void 0) {
      return null;
    }
    let name = this.collection[appId];
    return {
      name: String(name)
    };
  }
}
