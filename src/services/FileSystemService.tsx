import { v4 as uuidv4 } from 'uuid';

// File system types
export interface FSFile {
  id: string;
  name: string;
  type: 'file';
  content: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  owner: string;
  permissions: string;
  metadata?: Record<string, any>;
  encrypted?: boolean;
}

export interface FSDirectory {
  id: string;
  name: string;
  type: 'directory';
  children: Record<string, FSNode>;
  createdAt: Date;
  modifiedAt: Date;
  owner: string;
  permissions: string;
  metadata?: Record<string, any>;
}

export type FSNode = FSFile | FSDirectory;

// Initial file system structure
const initialFileSystem: FSDirectory = {
  id: 'root',
  name: '/',
  type: 'directory',
  children: {
    'home': {
      id: uuidv4(),
      name: 'home',
      type: 'directory',
      children: {
        'user': {
          id: uuidv4(),
          name: 'user',
          type: 'directory',
          children: {
            'Documents': {
              id: uuidv4(),
              name: 'Documents',
              type: 'directory',
              children: {
                'project_x.txt': {
                  id: uuidv4(),
                  name: 'project_x.txt',
                  type: 'file',
                  content: 'PROJECT X\n--------\nStatus: In Progress\nDeadline: ASAP\nSecurity Level: HIGHEST\n\nDetails classified.',
                  size: 97,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  owner: 'user',
                  permissions: 'rw-r--r--',
                },
                'meeting_notes.md': {
                  id: uuidv4(),
                  name: 'meeting_notes.md',
                  type: 'file',
                  content: '# Meeting with Proxima Corp\n- Discussed AI integration\n- Neural interface prototype demo\n- Security concerns re: backdoor access\n- Next meeting scheduled for 12/15',
                  size: 158,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  owner: 'user',
                  permissions: 'rw-r--r--',
                },
                'secrets.enc': {
                  id: uuidv4(),
                  name: 'secrets.enc',
                  type: 'file',
                  content: '[ENCRYPTED CONTENT - ACCESS DENIED]',
                  size: 34,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  owner: 'user',
                  permissions: 'rw-------',
                  encrypted: true,
                }
              },
              createdAt: new Date(),
              modifiedAt: new Date(),
              owner: 'user',
              permissions: 'rwxr-xr-x',
            },
            'Pictures': {
              id: uuidv4(),
              name: 'Pictures',
              type: 'directory',
              children: {
                'screenshot.png': {
                  id: uuidv4(),
                  name: 'screenshot.png',
                  type: 'file',
                  content: '[IMAGE BINARY DATA]',
                  size: 1024,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  owner: 'user',
                  permissions: 'rw-r--r--',
                },
                'cybercity.jpg': {
                  id: uuidv4(),
                  name: 'cybercity.jpg',
                  type: 'file',
                  content: '[IMAGE BINARY DATA]',
                  size: 2048,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  owner: 'user',
                  permissions: 'rw-r--r--',
                }
              },
              createdAt: new Date(),
              modifiedAt: new Date(),
              owner: 'user',
              permissions: 'rwxr-xr-x',
            },
            '.config': {
              id: uuidv4(),
              name: '.config',
              type: 'directory',
              children: {
                'system.ini': {
                  id: uuidv4(),
                  name: 'system.ini',
                  type: 'file',
                  content: '[SYSTEM]\ndebug=false\nencryption=enabled\nproxy=192.168.0.10:9050\nai_assist=true\n\n[NETWORK]\nfirewall=active\nvpn=enabled\nhostname=gensin-quantum',
                  size: 148,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  owner: 'user',
                  permissions: 'rw-------',
                }
              },
              createdAt: new Date(),
              modifiedAt: new Date(),
              owner: 'user',
              permissions: 'rwx------',
            },
            '.bash_history': {
              id: uuidv4(),
              name: '.bash_history',
              type: 'file',
              content: 'ls\ncat config.ini\nifconfig\nping 192.168.0.1\nssh admin@192.168.0.254\nexit',
              size: 72,
              createdAt: new Date(),
              modifiedAt: new Date(),
              owner: 'user',
              permissions: 'rw-------',
            }
          },
          createdAt: new Date(),
          modifiedAt: new Date(),
          owner: 'user',
          permissions: 'rwxr-xr-x',
        }
      },
      createdAt: new Date(),
      modifiedAt: new Date(),
      owner: 'root',
      permissions: 'rwxr-xr-x',
    },
    'bin': {
      id: uuidv4(),
      name: 'bin',
      type: 'directory',
      children: {
        'ls': {
          id: uuidv4(),
          name: 'ls',
          type: 'file',
          content: '[BINARY EXECUTABLE]',
          size: 512,
          createdAt: new Date(),
          modifiedAt: new Date(),
          owner: 'root',
          permissions: 'rwxr-xr-x',
        },
        'cat': {
          id: uuidv4(),
          name: 'cat',
          type: 'file',
          content: '[BINARY EXECUTABLE]',
          size: 256,
          createdAt: new Date(),
          modifiedAt: new Date(),
          owner: 'root',
          permissions: 'rwxr-xr-x',
        }
      },
      createdAt: new Date(),
      modifiedAt: new Date(),
      owner: 'root',
      permissions: 'rwxr-xr-x',
    },
    'etc': {
      id: uuidv4(),
      name: 'etc',
      type: 'directory',
      children: {
        'passwd': {
          id: uuidv4(),
          name: 'passwd',
          type: 'file',
          content: 'root:x:0:0::/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash',
          size: 69,
          createdAt: new Date(),
          modifiedAt: new Date(),
          owner: 'root',
          permissions: 'rw-r--r--',
        },
        'hosts': {
          id: uuidv4(),
          name: 'hosts',
          type: 'file',
          content: '127.0.0.1 localhost\n127.0.1.1 gensin-quantum',
          size: 41,
          createdAt: new Date(),
          modifiedAt: new Date(),
          owner: 'root',
          permissions: 'rw-r--r--',
        }
      },
      createdAt: new Date(),
      modifiedAt: new Date(),
      owner: 'root',
      permissions: 'rwxr-xr-x',
    }
  },
  createdAt: new Date(),
  modifiedAt: new Date(),
  owner: 'root',
  permissions: 'rwxr-xr-x',
};

// File system class to handle operations
export class FileSystemService {
  private fileSystem: FSDirectory;
  private static instance: FileSystemService;

  private constructor() {
    // Try to load file system from localStorage
    const storedFS = localStorage.getItem('gensin_fs');
    if (storedFS) {
      try {
        // Convert string dates back to Date objects
        const parsedFS = JSON.parse(storedFS, (key, value) => {
          if (key === 'createdAt' || key === 'modifiedAt') {
            return new Date(value);
          }
          return value;
        });
        this.fileSystem = parsedFS;
      } catch (e) {
        console.error('Error parsing stored file system:', e);
        this.fileSystem = initialFileSystem;
      }
    } else {
      this.fileSystem = initialFileSystem;
    }
  }

  // Get singleton instance
  public static getInstance(): FileSystemService {
    if (!FileSystemService.instance) {
      FileSystemService.instance = new FileSystemService();
    }
    return FileSystemService.instance;
  }

  // Save file system to localStorage
  private saveFS(): void {
    try {
      localStorage.setItem('gensin_fs', JSON.stringify(this.fileSystem));
    } catch (e) {
      console.error('Error saving file system:', e);
    }
  }

  // Parse path into parts
  private parsePath(path: string): string[] {
    // Handle both absolute and relative paths
    if (path.startsWith('/')) {
      path = path.slice(1); // Remove leading slash
    }
    return path ? path.split('/').filter(p => p && p !== '.') : [];
  }

  // Resolve parent directory and name from path
  private resolvePath(path: string): { parent: FSDirectory | null, name: string, fullPath: string[] } {
    const parts = this.parsePath(path);
    let current: FSDirectory = this.fileSystem;
    let parent: FSDirectory | null = null;
    
    if (parts.length === 0) {
      return { parent: null, name: '/', fullPath: [] };
    }
    
    const name = parts.pop() as string;
    
    for (const part of parts) {
      if (part === '..') {
        // Handle .. by going up one level
        if (parent) {
          current = parent;
          parent = null; // We'd need to traverse from root to find the new parent
        }
        continue;
      }
      
      parent = current;
      const child = current.children[part];
      
      if (!child || child.type !== 'directory') {
        throw new Error(`Directory not found: ${part}`);
      }
      
      current = child as FSDirectory;
    }
    
    return { parent: parts.length > 0 ? current : this.fileSystem, name, fullPath: parts.concat(name) };
  }

  // Get node at path
  public getNode(path: string): FSNode | null {
    if (path === '/' || path === '') {
      return this.fileSystem;
    }
    
    try {
      const { parent, name } = this.resolvePath(path);
      
      if (!parent) {
        return this.fileSystem;
      }
      
      return parent.children[name] || null;
    } catch (e) {
      console.error(`Error getting node at ${path}:`, e);
      return null;
    }
  }

  // List contents of a directory
  public listDirectory(path: string): Record<string, FSNode> {
    const node = this.getNode(path);
    
    if (!node) {
      throw new Error(`Path not found: ${path}`);
    }
    
    if (node.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }
    
    return node.children;
  }

  // Read file content
  public readFile(path: string): string {
    const node = this.getNode(path);
    
    if (!node) {
      throw new Error(`File not found: ${path}`);
    }
    
    if (node.type !== 'file') {
      throw new Error(`Not a file: ${path}`);
    }
    
    return node.content;
  }

  // Write to file
  public writeFile(path: string, content: string): void {
    const node = this.getNode(path);
    
    if (node && node.type === 'file') {
      // Update existing file
      node.content = content;
      node.size = content.length;
      node.modifiedAt = new Date();
    } else {
      // Create new file
      const { parent, name } = this.resolvePath(path);
      
      if (!parent) {
        throw new Error(`Cannot create file at root level`);
      }
      
      if (parent.children[name]) {
        throw new Error(`Path already exists and is not a file: ${path}`);
      }
      
      parent.children[name] = {
        id: uuidv4(),
        name,
        type: 'file',
        content,
        size: content.length,
        createdAt: new Date(),
        modifiedAt: new Date(),
        owner: 'user', // Default owner
        permissions: 'rw-r--r--' // Default permissions
      };
    }
    
    this.saveFS();
  }

  // Create directory
  public mkdir(path: string): void {
    const node = this.getNode(path);
    
    if (node) {
      throw new Error(`Path already exists: ${path}`);
    }
    
    const { parent, name } = this.resolvePath(path);
    
    if (!parent) {
      throw new Error(`Cannot create directory at root level`);
    }
    
    parent.children[name] = {
      id: uuidv4(),
      name,
      type: 'directory',
      children: {},
      createdAt: new Date(),
      modifiedAt: new Date(),
      owner: 'user', // Default owner
      permissions: 'rwxr-xr--' // Default permissions
    };
    
    this.saveFS();
  }

  // Remove file or directory
  public remove(path: string, recursive: boolean = false): void {
    if (path === '/' || path === '') {
      throw new Error('Cannot remove root directory');
    }
    
    const node = this.getNode(path);
    
    if (!node) {
      throw new Error(`Path not found: ${path}`);
    }
    
    const { parent, name } = this.resolvePath(path);
    
    if (!parent) {
      throw new Error(`Cannot remove root-level item`);
    }
    
    if (node.type === 'directory' && Object.keys(node.children).length > 0 && !recursive) {
      throw new Error(`Directory not empty: ${path}`);
    }
    
    delete parent.children[name];
    this.saveFS();
  }

  // Copy a file or directory
  public copy(source: string, destination: string): void {
    const sourceNode = this.getNode(source);
    
    if (!sourceNode) {
      throw new Error(`Source not found: ${source}`);
    }
    
    // Deep clone the source node
    const clonedNode = JSON.parse(JSON.stringify(sourceNode));
    
    // Update timestamps
    const updateTimestamps = (node: any) => {
      node.createdAt = new Date();
      node.modifiedAt = new Date();
      
      if (node.type === 'directory' && node.children) {
        for (const childName in node.children) {
          updateTimestamps(node.children[childName]);
        }
      }
    };
    
    updateTimestamps(clonedNode);
    
    // Update IDs to make them unique
    const updateIds = (node: any) => {
      node.id = uuidv4();
      
      if (node.type === 'directory' && node.children) {
        for (const childName in node.children) {
          updateIds(node.children[childName]);
        }
      }
    };
    
    updateIds(clonedNode);
    
    const { parent, name } = this.resolvePath(destination);
    
    if (!parent) {
      throw new Error(`Cannot copy to root level`);
    }
    
    // Update the name to match the destination
    clonedNode.name = name;
    
    parent.children[name] = clonedNode;
    this.saveFS();
  }

  // Move a file or directory
  public move(source: string, destination: string): void {
    this.copy(source, destination);
    this.remove(source, true);
  }

  // Search for files matching a pattern
  public search(pattern: string, path: string = '/'): FSNode[] {
    const results: FSNode[] = [];
    const regex = new RegExp(pattern);
    
    const searchIn = (node: FSNode, nodePath: string) => {
      if (regex.test(node.name)) {
        results.push(node);
      }
      
      if (node.type === 'directory') {
        for (const childName in node.children) {
          const childPath = nodePath === '/' ? `/${childName}` : `${nodePath}/${childName}`;
          searchIn(node.children[childName], childPath);
        }
      }
    };
    
    const startNode = this.getNode(path);
    if (startNode) {
      searchIn(startNode, path);
    }
    
    return results;
  }
}

export default FileSystemService; 