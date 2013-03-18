D3 Patches
==========

This directory contains the individual patch files to make D3 work in Internet Explorer.

Adding a Patch
---------------

To patch a d3 module, copy its contents from ```lib/d3/src``` into this directory then modify the code as needed to function in Internet Explorer.
Once the patch has been made, update the makefile to reference the patched module and re-run the ```make``` command.