import os
import subprocess

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the path to the 'objects_videos' folder
base_dir = os.path.join(script_dir, "objects_videos")

# Loop through all MP4 files in subdirectories
for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".mp4"):
            video_path = os.path.join(root, file)

            # Check rotation metadata using ffprobe
            cmd = [
                "ffprobe", "-v", "error", "-select_streams", "v:0",
                "-show_entries", "side_data=displaymatrix",
                "-of", "default=noprint_wrappers=1", video_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            rotation = result.stdout.strip()

            if "rotation of -90.00 degrees" in rotation or "rotation of 90.00 degrees" in rotation:
                print(f"Fixing {video_path}...")

                # Generate new filename
                fixed_video_path = video_path.replace(".mp4", "_fixed.mp4")

                # Rotate video by 180 degrees
                ffmpeg_cmd = [
                    "ffmpeg", "-i", video_path, "-vf", "transpose=2,transpose=2",
                    "-c:v", "libx264", "-c:a", "copy", fixed_video_path
                ]
                subprocess.run(ffmpeg_cmd)

                # Replace original video
                os.replace(fixed_video_path, video_path)
                print(f"Fixed: {video_path}")
            else:
                print(f"Skipping {video_path}, no rotation needed.")

