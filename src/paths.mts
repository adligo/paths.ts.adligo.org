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

function isWindows() {
  let osString: string = process.platform;
  if (osString == "win32") {
    return true;
  } else if (osString == "win64") {
    return true;
  }
  return false;
}
const IS_WINDOWS = isWindows();


export class Paths {
    static SMALL_PATH_ERROR  ="Unable to parse paths of length 3 or smaller!";
    static NON_UNIX_PATH_ERROR = "The following unixPath is not a fully qualified path!;\n";
    /**
     * 
     * @param path a fully qualified path
     * @returns 
     */
    static toUnix(path: string): string {
      var r = '';
      if (path.length > 3) {
        if (path.charAt(1) == ':') {
          r = '/c/';
          for (var i=3; i< path.length; i++) {
            let c = path[i];
            if (c == '\\') {
              r = r.concat('/');
            } else {
              r = r.concat(c);
            }
          }
        } else {
          //assume unix path already!
          return path;
        }
      } else {
        throw Error(Paths.SMALL_PATH_ERROR);
      }
      return r;
    }
  
    static toUnixPath(parts: string[]): string {
      let b = '/';
      for (var i=0; i < parts.length; i++) {
        if (i == parts.length - 1) {
          b = b.concat(parts[i]);
        } else {
          b = b.concat(parts[i]).concat('/');
        }
      }
      return b;
    }
  
    static toWindowsPath(parts: string[]): string {
      let b = '';
      for (var i=0; i < parts.length; i++) {
        if (i == 0) {
          b = parts[0].toUpperCase() + ':\\';
        } else if (i == parts.length -1) {
          b = b.concat(parts[i]);
        } else {
          b = b.concat(parts[i]).concat('\\');
        }
      }
      return b;
    }
  
    static toOsPath(path: string): string {
      let parts = this.toParts(path);
      if (IS_WINDOWS) {
        return this.toWindowsPath(parts);
      } else {
        return this.toUnixPath(parts);
      }
    }
    /**
     * 
     * @param unixPath a fully qualified path
     */
    static toParts(unixPath: string): string[] {
      let r: string[] = new Array();
      let b = '';
      var j = 0;
      if (unixPath.charAt(0) != '/') {
        throw Error(Paths.NON_UNIX_PATH_ERROR + unixPath);
      }
      for (var i=1; i< unixPath.length; i++) {
        let c = unixPath[i];
        if (c == '/') {
          if (b.length != 0) {
            r[j] = b;
            b = '';
            j++;
          }
        } else {
          b = b.concat(c);
        }
      }
      r[j] = b;
      return r;
    }
  }