// src/data/projects.ts

import type { ProjectData } from '../types';
import { projectRecho } from './project/projectRecho';
import { projectTeacherTest } from './project/projectTeacherTest';
import { projectTestMaker } from './project/projectTestMaker';
// 아이콘 경로는 실제 프로젝트에 맞게 수정해주세요.

export const projects: ProjectData[] = [
  projectRecho,
  projectTestMaker,
  projectTeacherTest,
];
