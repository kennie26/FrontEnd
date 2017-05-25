import $ from 'jquery';
import 'slick-carousel';

$('.slider').slick({
	dots: true,
	speed: 500
});

for (let i = 0; i < 5; i++) {
	console.log('hi');
};