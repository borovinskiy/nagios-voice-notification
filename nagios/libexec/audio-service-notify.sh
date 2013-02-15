#!/usr/bin/perl
##/bin/bash
##/usr/bin/curl -G --data-urlencode "text=$1. Service: $2 Host $3 change state to $5. Information: $7" http://localhost:81/send/msg
#/usr/bin/curl -G --data-urlencode "text=$1. Сервис: $2 на хосте $3 в $5 состоянии." http://localhost:81/send/msg
## /usr/bin/printf  "%b" "***** Nagios *****\n\n\nNotification Type: "$1"\n\nService: "$2"\nHost: "$3"\nAddress: "$4"\nState: "$5"\n\nDate/Time: "$6" \n\nAdditional Info:\n\n "$7" \n\n\n\n\n" | /usr/bin/sendxmpp -f /home/nagios/.sendxmpprc -s "Nagios Alert" "$8"

do '/usr/local/nagios/libexec/translate.pl';

#my $string = '/usr/bin/curl -G --data-urlencode "text='.&string_translate($ARGV[0]).' Сервис: '.&string_translate($ARGV[1]).' на хосте '.&string_translate($ARGV[2]).' в '.&string_translate($ARGV[4]).' состоянии." http://localhost:81/send/msg';
my $string = '/usr/bin/curl -G --data-urlencode "text=Насяльника! '.&string_translate($ARGV[0]).' Сервиса: '.&string_translate($ARGV[1]).' на машина '.&string_translate($ARGV[2]).' совсем-совсем '.&string_translate($ARGV[4]).' аднака." http://localhost:81/send/msg';



#print $string;

my $res = exec($string);

