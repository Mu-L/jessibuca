
#!/usr/bin/python

# import tools.shared as emscripten
import os
import sys
import getopt
from subprocess import Popen, PIPE, STDOUT
args = {'-o': '../src/decoder/decoder-smid'}

sargs = {
    'WASM': 1,
    'TOTAL_MEMORY': 67108864,
    'ASSERTIONS': 1,
    'ERROR_ON_UNDEFINED_SYMBOLS': 0,
    'DISABLE_EXCEPTION_CATCHING': 1,
    'INVOKE_RUN':0,
    'USE_PTHREADS':  0,
    'ALLOW_MEMORY_GROWTH':1,
}
emcc_args = [
     '-msimd128',
    # '-m32',
    '-Oz',
    '--memory-init-file', '0',
    # '--closure', '1',
    # '--llvm-lto','1',
    '--bind',
    '-I.', '-Iobj/include',
    '--pre-js','./pre.js',
    '--post-js','./post.js'
]+["-s "+k+"="+str(v) for k, v in sargs.items()]

print ('building...')

emcc_args = ['obj/lib/libavcodec.a','obj/lib/libavutil.a','obj/lib/libswresample.a']+emcc_args

os.system('emcc ./decoder.cpp ' +
          (' '.join(emcc_args)) + ' -o '+args['-o']+'.js')

print ('done')
