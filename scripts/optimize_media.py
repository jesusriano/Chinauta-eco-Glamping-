import os
import subprocess
from pathlib import Path

def optimize_image(src_path, is_hero=False, is_logo=False):
    src = Path(src_path)
    if not src.exists():
        return
    
    orig_size = src.stat().st_size
    temp_jpg = src.with_suffix('.tmp.jpg')
    temp_webp = src.with_suffix('.webp')
    
    if is_logo:
        resize_arg = "400x400>"
        quality = "88"
    elif is_hero:
        resize_arg = "1920x1080>"
        quality = "85"
    else:
        resize_arg = "1440x960>"
        quality = "82"

    # Optimize JPG in place
    cmd_jpg = [
        'convert', str(src),
        '-strip',
        '-resize', resize_arg,
        '-quality', quality,
        '-interlace', 'Plane',
        str(temp_jpg)
    ]
    subprocess.run(cmd_jpg, check=True)
    
    # Generate companion WebP
    cmd_webp = [
        'convert', str(src),
        '-strip',
        '-resize', resize_arg,
        '-quality', str(int(quality) - 2),
        str(temp_webp)
    ]
    subprocess.run(cmd_webp, check=True)
    
    new_jpg_size = temp_jpg.stat().st_size
    new_webp_size = temp_webp.stat().st_size
    
    # Overwrite source JPG if smaller
    if new_jpg_size < orig_size:
        temp_jpg.replace(src)
        final_jpg_size = new_jpg_size
    else:
        temp_jpg.unlink(missing_ok=True)
        final_jpg_size = orig_size
        
    print(f"IMG {src.name:45} | orig: {orig_size/1024:6.1f}KB -> jpg: {final_jpg_size/1024:6.1f}KB ({((orig_size-final_jpg_size)/orig_size)*100:4.1f}% red) | webp: {new_webp_size/1024:6.1f}KB")

def optimize_video(src_path):
    src = Path(src_path)
    if not src.exists():
        return
    
    orig_size = src.stat().st_size
    temp_mp4 = src.with_suffix('.tmp.mp4')
    
    # Check dimensions
    probe_cmd = ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', str(src)]
    res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, text=True)
    dims = res.stdout.strip().split('x')
    
    scale_filter = "scale='min(1280,iw)':-2"
    if len(dims) == 2 and int(dims[0]) < int(dims[1]):
        # Vertical video (e.g., 576x1024)
        scale_filter = "scale=-2:'min(1024,ih)'"
        
    cmd_mp4 = [
        'ffmpeg', '-y', '-i', str(src),
        '-vf', scale_filter,
        '-c:v', 'libx264',
        '-crf', '26',
        '-preset', 'medium',
        '-movflags', '+faststart',
        '-c:a', 'aac',
        '-b:a', '96k',
        str(temp_mp4)
    ]
    result = subprocess.run(cmd_mp4, stderr=subprocess.PIPE)
    if result.returncode == 0 and temp_mp4.exists():
        new_size = temp_mp4.stat().st_size
        if new_size < orig_size:
            temp_mp4.replace(src)
            print(f"VID {src.name:45} | orig: {orig_size/(1024*1024):6.2f}MB -> new: {new_size/(1024*1024):6.2f}MB ({((orig_size-new_size)/orig_size)*100:4.1f}% reduction)")
        else:
            temp_mp4.unlink(missing_ok=True)
            print(f"VID {src.name:45} | kept original size: {orig_size/(1024*1024):6.2f}MB")
    else:
        temp_mp4.unlink(missing_ok=True)
        print(f"VID {src.name:45} | ffmpeg skipped or failed")

def main():
    print("=== Optimizing Images in public/assets/images and public/logo.jpg ===")
    hero_images = ['chinauta_romantic_dome_night.jpg', 'chinauta_romantic_dome_night_1790624852355.jpg']
    
    for img_path in sorted(Path('public/assets/images').glob('*.jpg')):
        is_hero = img_path.name in hero_images
        is_logo = 'logo' in img_path.name
        optimize_image(img_path, is_hero=is_hero, is_logo=is_logo)
        
    if Path('public/logo.jpg').exists():
        optimize_image('public/logo.jpg', is_logo=True)

    print("\n=== Optimizing Videos in public/assets/videos ===")
    for vid_path in sorted(Path('public/assets/videos').glob('*.mp4')):
        optimize_video(vid_path)

    # Sync optimized files to src/assets
    print("\n=== Syncing optimized files to src/assets ===")
    for p in Path('public/assets').glob('**/*'):
        if p.is_file():
            rel = p.relative_to('public/assets')
            target = Path('src/assets') / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(p.read_bytes())
    print("Sync complete.")

if __name__ == '__main__':
    main()
