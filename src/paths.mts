/**
  * Copyright 2023 Adligo Inc / Scott Morgan
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

import { I_Path, I_Paths } from './i_paths.ts.adligo.org@slink/i_paths.mjs';


export class Path implements I_Path {
  private relative: boolean;
  private parts: string[];
  private windows: boolean;

  constructor(parts: string[], relative?: boolean, windows?: boolean) {
    if (relative == undefined) {
      this.relative = false;
    } else {
      this.relative = relative;
    }
    this.parts = parts;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] == undefined) {
        throw Error('Parts must have valid strings! ' + parts);
      }
    }
    if (windows == undefined) {
      this.windows = false;
    } else {
      this.windows = windows;
    }
  }

  equals(obj: any) : boolean {
    let other: I_Path = obj as I_Path;
    if (other.isRelative == undefined) {
      return false;
    } else if (other.isRelative() != this.isRelative()) {
      return false;
    }

    if (other.isWindows == undefined) {
      return false;
    } else if (other.isWindows() != this.isWindows()) {
      return false;
    }

    if (other.getParts == undefined) {
      return false;
    } else {
      let op: string [] = other.getParts();
      if (op.length != this.parts.length) {
        return false;
      }
      for (var i =0; i< this.parts.length; i++) {
        if (op[i] != this.parts[i]) {
          return false;
        }
      }
    }
    return true;
  }

  isRelative(): boolean  { return this.relative; }
  isWindows(): boolean { return this.windows; }
  getParts(): string[] { return this.parts.slice(0, this.parts.length ); }
  toString(): string { return 'Path [parts=' + this.parts + ', relative=' + this.relative + ', windows=' + this.windows + ']'}
  toPathString(): string {
    var r : string = '';
    if  (this.windows) {
      if (this.relative) {
        r = r.concat(this.parts[0] + '\\');
        return this.concat(r, '\\');
      } else {
        r = r.concat(this.parts[0] + ':\\');
        return this.concat(r, '\\');
      }
    } else {
      if (this.relative) {
        return this.concat(r, '/');
      } else {
        r = r.concat('/');
        return this.concat(r, '/');
      }
    }
  }

  toUnix(path: I_Path): I_Path {
    return new Path(path.getParts(), path.isRelative(), false);
  }

  toWindows(path: I_Path): I_Path {
    return new Path(path.getParts(), path.isRelative(), true);
  }

  private concat(start: string, sep: string ): string {
    for (var i = 0; i < this.parts.length; i++) {
      if (this.parts.length -1 == i) {
        start = start.concat(this.parts[i]);
      } else {
        start = start.concat(this.parts[i]).concat(sep);
      }
    }
    return start;
  }
}

export class Paths implements I_Paths {
  static INVALID_PATH_STRING = "Invalid path string; ";
  static NON_UNIX_PATH_ERROR = "The following unixPath is not a fully qualified path!;\n";
  static SMALL_PATH_ERROR  ="Unable to parse paths of length 3 or smaller!";
  static SPACES_NOT_ALLOWED_ERROR = "Spaces are NOT allowed in Paths! ";

  /**
   * 
   * @param path a relative or absolute path
   */
  normalize(path: string): I_Path {
    if (path == undefined || path.length == 0) {
      throw Error("Invalid path string; " + path);
    }
    let r: string[] = new Array();
    let b = '';
    var j = 0;
    for (var i=1; i< path.length; i++) {
      let c = path[i];
      if (c == '/') {
        if (b.length != 0) {
          r[j] = b;
          b = '';
          j++;
        }
      } else if (c == '\\') {
        if (b.length != 0) {
          r[j] = b;
          b = '';
          j++;
        }
      } else if (c == ' ') {
        throw Error(Paths.SPACES_NOT_ALLOWED_ERROR + path);
      } else {
        b = b.concat(c);
      }
    }
    r[j] = b;
    if (path.length >= 2) {
      switch(r[0]) {
        case '.': return this.toPath(r, path.charAt(1));
        case '..': return this.toPath(r, path.charAt(2));
        default:
          if (path.charAt(1) == ':') {
            return new Path(r, false, true); 
          }
          return new Path(r, false, false); 
      }
    } else {
      switch (path.charAt(0)) {
        case '/': return new Path(r, false, false); 
        case '\\': return new Path(r, false, true);
        // the '.' case and others
        default: return new Path(r, true, false); 
      }
    }
  }

  private toPath(parts: string[], firstPathChar: string) : I_Path {
    switch (firstPathChar) {
      case '/': return new Path(parts, true, true); 
      default: return new Path(parts, true, true);
    }
  } 
}