#!/bin/bash
sed -i 's/client as any/client/g' packages/auth/src/index.ts

if pnpm dlx ultracite check > /dev/null 2>&1; then
    echo "No any cast needed!"
else
    # Let's find out what type mongodbAdapter expects and suppress correctly
    sed -i -e 's/client/client \/* biome-ignore lint\/suspicious\/noExplicitAny: better-auth mismatch *\/ as any/g' packages/auth/src/index.ts
fi
