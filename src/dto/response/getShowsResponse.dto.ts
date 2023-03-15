import * as moment from 'moment-timezone'

export class getShowsResponse{
  status:boolean;
  message:string;
  shows:showObject[]; 

  constructor(status:boolean,message:string,shows:[]){
    this.status = status;
    this.message = message;
    this.shows = shows.map(item => new showObject(item))
  }

}

export class showObject{
  showId
  show_date
  price
  availableSeats
  screenId
  movieName
  movieDescription
  movieLanguage
  startTime
  screenName
  constructor(obj){
  this.showId = obj.showId; 
  this.screenName = obj.screenName; 
  this.show_date = moment(obj.startDateTime).tz('Asia/Kolkata').format('');
  this.price = obj.price;
  this.availableSeats = obj.availableSeats ;
  this.screenId = obj.screenId;
  this.movieName = obj.movieName; 
  this.movieDescription = obj.movieDescription ;
  this.movieLanguage = obj.movieLanguage ;
  this.startTime = obj.startTime;
  }
}