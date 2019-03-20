
module.exports.Team_eat = function (user) {

 var date_now = new Date;
 date_now = new Date(date_now - user.ship.team.created);
 var number_eating = Math.floor((((date_now.getFullYear()-1970)*365 + date_now.getMonth()*30 + (date_now.getDate()-1))*24 + (date_now.getHours()-3))/2);

 var team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
 var eat = number_eating * team
 if(eat > user.ship.supplies.food) {
   var team_death = eat - user.ship.supplies.food;
   if(team_death > team){
     user.ship.team.sailors = 0;
     user.ship.team.boarders = 0;
     user.ship.team.gunners = 0;
   }
   else {
     for(var i = 0; i <= team_death; i++){
       var rip = Math.floor(Math.random() * 3 + 1);
       if(rip == 1)  {
         if(user.ship.team.sailors != 0)
         user.ship.team.sailors = user.ship.team.sailors - 1;
         else   rip = 2;
       }
       if(rip == 2)  {
         if(user.ship.team.boarders != 0)
         user.ship.team.boarders = user.ship.team.boarders - 1;
         else   rip = 3;
       }
       if(rip == 3)  {
         if(user.ship.team.gunners != 0)
         user.ship.team.gunners = user.ship.team.gunners - 1;
         else   {if(user.ship.team.sailors != 0)
         user.ship.team.sailors = user.ship.team.sailors - 1;}
       }
     }
   }
   eat = user.ship.supplies.food;
 }

 user.ship.supplies.food = user.ship.supplies.food - eat;
 user.ship.team.created = new Date;

};
