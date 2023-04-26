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

import {I_String} from './i_strings.ts.adligo.org@slink/i_strings.mjs';

/**
 * A interface for a more complex description of filesystem paths
 * than a string.
 */
export interface I_Path {
  getParts(): string[];
  isRelative(): boolean;
  isWindows(): boolean;
  /**
   * 
   * @param path turn a path into a Unix path
   */
  toUnix(path: I_Path): I_Path;
  /**
   * turn a path into a a Windows path
   * @param path 
   */
  toWindows(path: I_Path): I_Path;
}

export interface I_Paths {

  /**
   * Convert any path into the current OS path,
   * i.e. C:/foo/bar is a path deliverd by node.js running in GitBash
   * on Windows sometimes (it should be C:\foo\bar or /c/foo/bar)
   * @param path 
   */
  normalize(path: string): I_Path;
}