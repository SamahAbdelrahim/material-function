import os
import json

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
print(script_dir)
# Define the path to the 'objects_videos' folder
base_dir = os.path.join(script_dir, "objects_videos")
print(base_dir)

video_data = {}

# Loop through each object folder inside 'objects_videos'
for folder in sorted(os.listdir(base_dir)):
    folder_path = os.path.join(base_dir, folder)
    if os.path.isdir(folder_path):  # Ensure it's a folder
        video_data[folder] = sorted([
            f"{folder}/{video}" for video in os.listdir(folder_path) if video.endswith(".mp4")
        ])

# Save the video filenames into a JSON file
output_file = os.path.join(script_dir, "video_list.json")
with open(output_file, "w") as f:
    json.dump(video_data, f, indent=2)

print(f"Video list saved to {output_file}")
