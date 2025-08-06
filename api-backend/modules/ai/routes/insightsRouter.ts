import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import axios from 'axios';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import { cp } from 'fs';

const router = express.Router();



export default router;