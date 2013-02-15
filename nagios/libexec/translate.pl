#!/usr/bin/perl

#my $word;
#foreach $param (@ARGV)  {
#  $word .= &string_translate($param);
#}
#print $word;


sub string_translate {
  my $string;
  foreach  $param (@_) {
#    print 'word is '.$word."\n";   
#    $word .= $param;
    @words = split(" ",$param);	# Разобьем строку на отдельные слова и будем переводить каждое слово в отдельности.
    foreach $en (@words) {
      $string .= &word_array($en)." ";
    }
  }
  
  return $string;
}

sub word_array() {
  $en = @_[0];
#print "Найден".$en."!\n";
  %enru = (
	"UP",		"Сделалось",		# восстановлен
	"DOWN",		"Упала",			# упал
	"Host",		"Хост",
	"HOST",		"ХОСТ",
	"Service",	"Сервис",
	"SERVICE",	"СЕРВИС",
	"CRITICAL",	"Плохая",			# критичном
	"OK",		"Холосая",			#нормальном
	"PROBLEM",	"Сламалося",				# СБОЙ
	"RECOVERY",	"ПОЧИНИЛОСЯ",		# ВОССТАНОВЛЕНИЕ
	"WARNING",	"СТРАШНО",
	);
  if (exists($enru{$en})) { return $enru{$en}; }		# Возвращаем русское слово если оно есть в массиве
  return $en;							# Если слово перевести не удалось, возвращаем все как есть.
}

