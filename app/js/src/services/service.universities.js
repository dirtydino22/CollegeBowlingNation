(function() {
    'use strict';
    angular.module('app.service.universities', []).factory('Universities', [
        function() {
            var universities = {};
            universities.list = [{
                "name": "Adelphi"
            }, {
                "name": "Adirondack CC"
            }, {
                "name": "Adrian"
            }, {
                "name": "AIB"
            }, {
                "name": "Akron"
            }, {
                "name": "Alabama"
            }, {
                "name": "Alabama A&M"
            }, {
                "name": "Alabama State"
            }, {
                "name": "Alabama-Birmingham"
            }, {
                "name": "Alcorn State"
            }, {
                "name": "Allegheny-Boyce"
            }, {
                "name": "Allegheny-North"
            }, {
                "name": "Allegheny-South"
            }, {
                "name": "Allen"
            }, {
                "name": "Alma"
            }, {
                "name": "Anne Arundel CC"
            }, {
                "name": "Aquinas"
            }, {
                "name": "Arizona"
            }, {
                "name": "Arizona State"
            }, {
                "name": "Ark. - Pine Bluff"
            }, {
                "name": "Arkansas"
            }, {
                "name": "Arkansas State"
            }, {
                "name": "Ashford"
            }, {
                "name": "Baker"
            }, {
                "name": "Ball State"
            }, {
                "name": "Bellarmine"
            }, {
                "name": "Bethel-TN"
            }, {
                "name": "Bethune-Cookman"
            }, {
                "name": "Black Hills St."
            }, {
                "name": "Bloomsburg"
            }, {
                "name": "Boise State"
            }, {
                "name": "Bowie State"
            }, {
                "name": "Bowling Green State"
            }, {
                "name": "Briarcliffe"
            }, {
                "name": "Bryant"
            }, {
                "name": "Buffalo State"
            }, {
                "name": "Cal. - Davis"
            }, {
                "name": "Cal. - Los Angeles"
            }, {
                "name": "Cal. Poly"
            }, {
                "name": "Cal.- Santa Barbara"
            }, {
                "name": "Cal.St.- Chico"
            }, {
                "name": "Cal.St.- Fresno"
            }, {
                "name": "Cal.St.- Fullerton"
            }, {
                "name": "Cal.St.- Long Beach"
            }, {
                "name": "Cal.St.- Northridge"
            }, {
                "name": "Cal.St.- Sacramento"
            }, {
                "name": "Calumet"
            }, {
                "name": "Campbellsville"
            }, {
                "name": "Canisius"
            }, {
                "name": "Cardinal Stritch"
            }, {
                "name": "Carthage"
            }, {
                "name": "Cayuga CC"
            }, {
                "name": "Central Florida"
            }, {
                "name": "Central Michigan"
            }, {
                "name": "Central Missouri"
            }, {
                "name": "Central Oklahoma"
            }, {
                "name": "Central Washington"
            }, {
                "name": "Chaffey"
            }, {
                "name": "Cheyney"
            }, {
                "name": "Chowan"
            }, {
                "name": "Cincinnati"
            }, {
                "name": "Clackamas CC"
            }, {
                "name": "Clarion"
            }, {
                "name": "Clarke"
            }, {
                "name": "Clarkson"
            }, {
                "name": "Clemson"
            }, {
                "name": "Colorado Mines"
            }, {
                "name": "Colorado St.- Pueblo"
            }, {
                "name": "Colorado State"
            }, {
                "name": "Columbia-Greene CC"
            }, {
                "name": "Concordia"
            }, {
                "name": "Coppin State"
            }, {
                "name": "Cornell"
            }, {
                "name": "Corning CC"
            }, {
                "name": "Cumberland"
            }, {
                "name": "Cumberlands"
            }, {
                "name": "Davenport"
            }, {
                "name": "Delaware"
            }, {
                "name": "Delaware State"
            }, {
                "name": "Delta"
            }, {
                "name": "Dutchess CC"
            }, {
                "name": "East Carolina"
            }, {
                "name": "Eastern Illinois"
            }, {
                "name": "Eastern Michigan"
            }, {
                "name": "Elizabeth City St."
            }, {
                "name": "Elmhurst"
            }, {
                "name": "Emmanuel"
            }, {
                "name": "Emporia State"
            }, {
                "name": "Erie CC"
            }, {
                "name": "Fairleigh Dickinson"
            }, {
                "name": "Fashion Institute"
            }, {
                "name": "Fayetteville State"
            }, {
                "name": "Ferris State"
            }, {
                "name": "Florida"
            }, {
                "name": "Florida A&M"
            }, {
                "name": "Florida Atlantic"
            }, {
                "name": "Florida Inter."
            }, {
                "name": "Florida State"
            }, {
                "name": "Fontbonne"
            }, {
                "name": "George Mason"
            }, {
                "name": "Georgia College"
            }, {
                "name": "Georgia Southern"
            }, {
                "name": "Georgia Tech"
            }, {
                "name": "Globe Institute"
            }, {
                "name": "Graceland"
            }, {
                "name": "Grambling State"
            }, {
                "name": "Grand Canyon"
            }, {
                "name": "Grand Valley State"
            }, {
                "name": "Grand View"
            }, {
                "name": "Hampton"
            }, {
                "name": "Hastings"
            }, {
                "name": "Herkimer CCC"
            }, {
                "name": "Highland CC"
            }, {
                "name": "Holy Family"
            }, {
                "name": "Houston"
            }, {
                "name": "Howard"
            }, {
                "name": "Hudson Valley CC"
            }, {
                "name": "Huntington"
            }, {
                "name": "Idaho"
            }, {
                "name": "Idaho State"
            }, {
                "name": "Illinois - Chicago"
            }, {
                "name": "Illinois - Urbana"
            }, {
                "name": "Illinois State"
            }, {
                "name": "Illinois Tech"
            }, {
                "name": "Indiana"
            }, {
                "name": "Indiana - PA"
            }, {
                "name": "Indiana State"
            }, {
                "name": "Indiana Tech"
            }, {
                "name": "Indiana-S.Bend"
            }, {
                "name": "Iowa"
            }, {
                "name": "Iowa Central CC"
            }, {
                "name": "Iowa State"
            }, {
                "name": "Jackson State"
            }, {
                "name": "James Madison"
            }, {
                "name": "JC Smith"
            }, {
                "name": "Kansas"
            }, {
                "name": "Kansas State"
            }, {
                "name": "Kent State"
            }, {
                "name": "King"
            }, {
                "name": "Kutztown"
            }, {
                "name": "Lafayette"
            }, {
                "name": "Landmark"
            }, {
                "name": "Las Positas"
            }, {
                "name": "Lawrence Tech"
            }, {
                "name": "Lee"
            }, {
                "name": "Lehigh"
            }, {
                "name": "Lewis and Clark"
            }, {
                "name": "Lincoln"
            }, {
                "name": "Linden.-Belleville"
            }, {
                "name": "Lindenwood"
            }, {
                "name": "Lindsey Wilson"
            }, {
                "name": "Linfield"
            }, {
                "name": "Livingstone"
            }, {
                "name": "Long Island"
            }, {
                "name": "Louisiana State"
            }, {
                "name": "Louisiana Tech"
            }, {
                "name": "Louisiana-Lafayette"
            }, {
                "name": "Louisville"
            }, {
                "name": "Marian"
            }, {
                "name": "Marist"
            }, {
                "name": "Marquette"
            }, {
                "name": "Martin Methodist"
            }, {
                "name": "Maryland-Balt.Co."
            }, {
                "name": "Maryland-Coll.Park"
            }, {
                "name": "Maryland-E.Shore"
            }, {
                "name": "Maryland-Univ.Coll."
            }, {
                "name": "McKendree"
            }, {
                "name": "Medaille"
            }, {
                "name": "Mesa CC"
            }, {
                "name": "Miami"
            }, {
                "name": "Miami - OH"
            }, {
                "name": "Michigan"
            }, {
                "name": "Michigan - Flint"
            }, {
                "name": "Michigan State"
            }, {
                "name": "Michigan-Dearborn"
            }, {
                "name": "Mid. Tennessee St."
            }, {
                "name": "Midland"
            }, {
                "name": "Millersville"
            }, {
                "name": "Milwaukee Eng."
            }, {
                "name": "Minn.-Twin Cities"
            }, {
                "name": "Minn.St.-Mankato"
            }, {
                "name": "Mississippi Vall."
            }, {
                "name": "Missouri Baptist"
            }, {
                "name": "Missouri State"
            }, {
                "name": "Mohawk Valley CC"
            }, {
                "name": "Monmouth"
            }, {
                "name": "Monroe CCC"
            }, {
                "name": "Montana"
            }, {
                "name": "Montana State"
            }, {
                "name": "Morehead State"
            }, {
                "name": "Morgan State"
            }, {
                "name": "Morningside"
            }, {
                "name": "Mount Aloysius"
            }, {
                "name": "Mount Mercy"
            }, {
                "name": "Mount Union"
            }, {
                "name": "Muskingum"
            }, {
                "name": "N. Carolina A&T"
            }, {
                "name": "N. Carolina Cent."
            }, {
                "name": "N. Carolina State"
            }, {
                "name": "N. Carolina-Charl."
            }, {
                "name": "Nassau CC"
            }, {
                "name": "Nebraska - Kearney"
            }, {
                "name": "Nebraska - Lincoln"
            }, {
                "name": "Nebraska - Omaha"
            }, {
                "name": "Nevada - Las Vegas"
            }, {
                "name": "Nevada - Reno"
            }, {
                "name": "New Haven"
            }, {
                "name": "New Jersey"
            }, {
                "name": "New Jersey City"
            }, {
                "name": "New Jersey Tech"
            }, {
                "name": "New Mexico"
            }, {
                "name": "New Mexico State"
            }, {
                "name": "Newman"
            }, {
                "name": "Niagara CCC"
            }, {
                "name": "Norfolk State"
            }, {
                "name": "North Dakota State"
            }, {
                "name": "North Harris"
            }, {
                "name": "North Texas"
            }, {
                "name": "Northeastern St."
            }, {
                "name": "Northern Illinois"
            }, {
                "name": "Northern Iowa"
            }, {
                "name": "Northern Kentucky"
            }, {
                "name": "Notre Dame"
            }, {
                "name": "Notre Dame - OH"
            }, {
                "name": "NW Ohio"
            }, {
                "name": "Oberlin"
            }, {
                "name": "Ohio Dominican"
            }, {
                "name": "Ohio State"
            }, {
                "name": "Ohio-Chillicothe"
            }, {
                "name": "Oklahoma"
            }, {
                "name": "Oklahoma State"
            }, {
                "name": "Oregon"
            }, {
                "name": "Oregon State"
            }, {
                "name": "Our Lady"
            }, {
                "name": "Palmer"
            }, {
                "name": "Paul Smith's"
            }, {
                "name": "PennSt.-Altoona"
            }, {
                "name": "PennSt.-Berks/Leh."
            }, {
                "name": "PennSt.-Harrisburg"
            }, {
                "name": "PennSt.-Main"
            }, {
                "name": "Pikeville"
            }, {
                "name": "Pitt.-Bradford"
            }, {
                "name": "Pitt.-Greensburg"
            }, {
                "name": "Pittsburgh"
            }, {
                "name": "Portland CC"
            }, {
                "name": "Prairie View A&M"
            }, {
                "name": "Purdue"
            }, {
                "name": "R.Morris-Illinois"
            }, {
                "name": "R.Morris-Lake Co."
            }, {
                "name": "R.Morris-Peoria"
            }, {
                "name": "R.Morris-Springfield"
            }, {
                "name": "Radford"
            }, {
                "name": "Ripon"
            }, {
                "name": "Robert Morris-PA"
            }, {
                "name": "Rochester Tech"
            }, {
                "name": "Rock Valley"
            }, {
                "name": "Rockland CC"
            }, {
                "name": "Rose-Hulman IT"
            }, {
                "name": "S.Ill.-Carbondale"
            }, {
                "name": "S.Ill.-Edwardsville"
            }, {
                "name": "Sacred Heart"
            }, {
                "name": "Saginaw Valley St."
            }, {
                "name": "Salem Inter."
            }, {
                "name": "Sam Houston State"
            }, {
                "name": "San Diego State"
            }, {
                "name": "San Jose State"
            }, {
                "name": "Santa Fe"
            }, {
                "name": "Savannah State"
            }, {
                "name": "Schenectady CCC"
            }, {
                "name": "Schoolcraft"
            }, {
                "name": "Shaw"
            }, {
                "name": "Shippensburg"
            }, {
                "name": "Siena Heights"
            }, {
                "name": "South Carolina St."
            }, {
                "name": "South Dakota State"
            }, {
                "name": "South Florida"
            }, {
                "name": "Southern"
            }, {
                "name": "Southern Cal."
            }, {
                "name": "Southern Indiana"
            }, {
                "name": "Southern Oregon"
            }, {
                "name": "Southern Utah"
            }, {
                "name": "Southwestern CC"
            }, {
                "name": "Spalding"
            }, {
                "name": "Spokane Falls CC"
            }, {
                "name": "Spring Hill"
            }, {
                "name": "St. Ambrose"
            }, {
                "name": "St. Augustine's"
            }, {
                "name": "St. Catharine"
            }, {
                "name": "St. Clair CC"
            }, {
                "name": "St. Cloud State"
            }, {
                "name": "St. Francis-IL"
            }, {
                "name": "St. Francis-NY"
            }, {
                "name": "St. Francis-PA"
            }, {
                "name": "St. John's"
            }, {
                "name": "St. Paul's"
            }, {
                "name": "St. Peter's"
            }, {
                "name": "St. Thomas"
            }, {
                "name": "Stanford"
            }, {
                "name": "Stephen F. Austin"
            }, {
                "name": "Stevens Institute"
            }, {
                "name": "Stonehill"
            }, {
                "name": "Stony Brook"
            }, {
                "name": "Suffolk - Grant"
            }, {
                "name": "SUNY - Albany"
            }, {
                "name": "SUNY - Binghamton"
            }, {
                "name": "SUNY - IT"
            }, {
                "name": "SW Christian"
            }, {
                "name": "Syracuse"
            }, {
                "name": "Tabor"
            }, {
                "name": "Technical Career"
            }, {
                "name": "Temple"
            }, {
                "name": "Tenn. - Chattanooga"
            }, {
                "name": "Tenn. - Knoxville"
            }, {
                "name": "Texas - Austin"
            }, {
                "name": "Texas - Dallas"
            }, {
                "name": "Texas A&M"
            }, {
                "name": "Texas Southern"
            }, {
                "name": "Texas State"
            }, {
                "name": "Texas Tech"
            }, {
                "name": "Toledo"
            }, {
                "name": "Towson"
            }, {
                "name": "Tulane"
            }, {
                "name": "U.S. Air Force"
            }, {
                "name": "U.S. Coast Guard"
            }, {
                "name": "Ulster CCC"
            }, {
                "name": "Union"
            }, {
                "name": "Urbana"
            }, {
                "name": "Ursuline"
            }, {
                "name": "Utah"
            }, {
                "name": "Utah State"
            }, {
                "name": "Utica"
            }, {
                "name": "Valparaiso"
            }, {
                "name": "Vanderbilt"
            }, {
                "name": "Victory"
            }, {
                "name": "Vincennes"
            }, {
                "name": "Virginia Comm."
            }, {
                "name": "Virginia State"
            }, {
                "name": "Virginia Tech"
            }, {
                "name": "Virginia Union"
            }, {
                "name": "Viterbo"
            }, {
                "name": "Volunteer State CC"
            }, {
                "name": "Waldorf"
            }, {
                "name": "Washington"
            }, {
                "name": "Washington State"
            }, {
                "name": "Wayne CCC"
            }, {
                "name": "Wayne State-NE"
            }, {
                "name": "Webber Int."
            }, {
                "name": "Weber State"
            }, {
                "name": "Webster"
            }, {
                "name": "West Point"
            }, {
                "name": "West Texas A&M"
            }, {
                "name": "West Virginia"
            }, {
                "name": "West. New England"
            }, {
                "name": "West. Washington"
            }, {
                "name": "Westchester CC"
            }, {
                "name": "Western Illinois"
            }, {
                "name": "Western Kentucky"
            }, {
                "name": "Western Michigan"
            }, {
                "name": "Westminster"
            }, {
                "name": "Wichita State"
            }, {
                "name": "William Paterson"
            }, {
                "name": "William Penn"
            }, {
                "name": "Winona State"
            }, {
                "name": "Winston-Salem St."
            }, {
                "name": "Wisc.-Eau Claire"
            }, {
                "name": "Wisc.-Green Bay"
            }, {
                "name": "Wisc.-LaCrosse"
            }, {
                "name": "Wisc.-Madison"
            }, {
                "name": "Wisc.-Milwaukee"
            }, {
                "name": "Wisc.-Oshkosh"
            }, {
                "name": "Wisc.-Parkside"
            }, {
                "name": "Wisc.-Platteville"
            }, {
                "name": "Wisc.-Stout"
            }, {
                "name": "Wisc.-Whitewater"
            }, {
                "name": "Wisconsin Lutheran"
            }, {
                "name": "Wright State"
            }, {
                "name": "Youngstown State"
            }, {
                "name": "Yuba"
            }];
            universities.get = function() {
                return universities.list;
            };
            return universities;
        }
    ]);

}).call(this);