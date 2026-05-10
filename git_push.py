#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git Push Script for StarMarket
Handles git operations with proper error handling
"""

import os
import sys
import subprocess

def run_command(cmd, check=True):
    """Run shell command and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            check=check,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return False, e.stdout, e.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    print("\n" + "="*50)
    print("  StarMarket - Git Push Script")
    print("="*50 + "\n")
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"Working directory: {script_dir}\n")
    
    # Check if git repository
    if not os.path.exists('.git'):
        print("❌ ERROR: Not a git repository!")
        print("\nPlease initialize git first:")
        print("  git init")
        print("  git remote add origin YOUR_GITHUB_URL")
        input("\nPress Enter to exit...")
        sys.exit(1)
    
    # Step 1: Check status
    print("[1/5] Checking git status...")
    success, stdout, stderr = run_command("git status", check=False)
    if success:
        print(stdout)
    else:
        print(f"⚠️  Warning: {stderr}")
    
    # Step 2: Add files
    print("\n[2/5] Adding all files...")
    success, stdout, stderr = run_command("git add .")
    if not success:
        print(f"❌ ERROR: Failed to add files\n{stderr}")
        input("\nPress Enter to exit...")
        sys.exit(1)
    print("✅ Files added")
    
    # Step 3: Commit
    print("\n[3/5] Committing changes...")
    commit_msg = "Security fixes and documentation update - v2.0.0"
    success, stdout, stderr = run_command(f'git commit -m "{commit_msg}"', check=False)
    if success:
        print("✅ Changes committed")
        print(stdout)
    else:
        if "nothing to commit" in stderr.lower():
            print("⚠️  Nothing to commit (no changes)")
        else:
            print(f"⚠️  Commit warning: {stderr}")
    
    # Step 4: Get current branch
    print("\n[4/5] Detecting branch...")
    success, branch, stderr = run_command("git branch --show-current")
    if success:
        branch = branch.strip()
        print(f"✅ Current branch: {branch}")
    else:
        branch = "main"
        print(f"⚠️  Could not detect branch, using: {branch}")
    
    # Step 5: Push
    print(f"\n[5/5] Pushing to GitHub ({branch})...")
    success, stdout, stderr = run_command(f"git push origin {branch}", check=False)
    
    if success:
        print("✅ SUCCESS! Changes pushed to GitHub")
        print(stdout)
    else:
        # Try alternative branch names
        if branch == "main":
            print("⚠️  'main' failed, trying 'master'...")
            success, stdout, stderr = run_command("git push origin master", check=False)
        elif branch == "master":
            print("⚠️  'master' failed, trying 'main'...")
            success, stdout, stderr = run_command("git push origin main", check=False)
        
        if success:
            print("✅ SUCCESS! Changes pushed to GitHub")
            print(stdout)
        else:
            print(f"❌ ERROR: Push failed!\n{stderr}")
            print("\nPossible reasons:")
            print("  1. No remote repository configured")
            print("  2. Authentication failed")
            print("  3. Branch name is different")
            print("\nTry manually:")
            print("  git remote -v")
            print("  git branch")
            print("  git push origin YOUR_BRANCH_NAME")
            input("\nPress Enter to exit...")
            sys.exit(1)
    
    # Success message
    print("\n" + "="*50)
    print("  ✅ SUCCESS! Changes pushed to GitHub")
    print("="*50)
    print("\nNext steps:")
    print("  1. Check GitHub repository")
    print("  2. Replace compromised keys (see SETUP_AFTER_SECURITY_FIX.md)")
    print("  3. Configure Vercel environment variables")
    print("  4. Redeploy project")
    print()
    input("Press Enter to exit...")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        input("\nPress Enter to exit...")
        sys.exit(1)
