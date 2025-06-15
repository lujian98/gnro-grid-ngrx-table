#!/bin/bash

src_dir=projects/gnro
dist_dir="../../dist/gnro"

cd "$src_dir"
mkdir "$dist_dir/theme/src/core"
mkdir "$dist_dir/theme/src/themes"

function loop_through_files() {
  for file in $(find "$1"/* -type f -name "_*"); do
    if [ -d "$file" ]; then
			loop_through_files "$file"
    elif [ "${file: -5}" == ".scss" ]; then
      echo "cp file: $file" 
			cp "$file" "$dist_dir/$file"
    fi
  done
}

loop_through_files "." 
cd ../../
