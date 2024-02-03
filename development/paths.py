import os

os.path.sep="/"

def generate_path_combinations(directory):
    path_combinations = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            path=os.path.join(root, file)[len(directory)+2:]
            
            path_combinations.append(path.replace("\\","/"))

    return path_combinations

directory_path = '../build'

paths='" "'.join(generate_path_combinations(directory_path))

with open('./paths.txt',"w") as f:
    f.write('{"'+paths+'"}')
