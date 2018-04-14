import path from 'path';

export function getRoot() {
  return path.resolve('');
}

export function getRootHtmlPath() {
  const path = getRoot() + '/dist/renderer/index.html';
  if (getOS() === 'win32') {
    return '/' + path.replace(/\\/g,'/');
  }
  return path;
}

export function getOS() {
  // mac -> darwin
  // win -> win32
  return process.platform;
}