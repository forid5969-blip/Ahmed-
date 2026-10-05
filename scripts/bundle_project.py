import os
import zipfile
import sys

def make_zip(output_filename="tickerline-source.zip"):
    # Root folder is the current directory
    root_dir = os.path.abspath(".")
    
    exclude_dirs = {
        "node_modules",
        ".git",
        ".aistudio",
        "dist",
        "build",
        ".cache",
        "__pycache__"
    }
    exclude_files = {
        output_filename,
        "tickerline-source.zip",
        "tickerline-project.tar.gz"
    }
    
    with zipfile.ZipFile(output_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Prune excluded directories
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs and not d.startswith(".git")]
            
            for file in filenames:
                if file in exclude_files or file.endswith(".tmp") or file.endswith(".pyc"):
                    continue
                full_path = os.path.join(dirpath, file)
                rel_path = os.path.relpath(full_path, root_dir)
                zipf.write(full_path, rel_path)
                
    print(f"Successfully created {output_filename} ({os.path.getsize(output_filename)} bytes)")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "tickerline-source.zip"
    make_zip(out)
