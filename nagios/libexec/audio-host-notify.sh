#!/usr/bin/perl
##!/bin/bash
##/usr/bin/curl -G --data-urlencode "text=$1. Host: $2 is $3. Information: $4" http://localhost:81/send/msg
#/usr/bin/curl -G --data-urlencode "text=$1. Host: $2  $3." http://localhost:81/send/msg

do '/usr/local/nagios/libexec/translate.pl';
#my $string = '/usr/bin/curl -G --data-urlencode "text='.&string_translate($ARGV[0]).' Хост: '.&string_translate($ARGV[1]).' '.&string_translate($ARGV[2]).'" http://localhost:81/send/msg';
my $string = '/usr/bin/curl -G --data-urlencode "text=Насяльника! '.&string_translate($ARGV[0]).' Твоя: '.&string_translate($ARGV[1]).' '.&string_translate($ARGV[2]).' аднака" http://localhost:81/send/msg';

my $res = exec($string);

