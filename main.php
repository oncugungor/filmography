<?php

function connectDB(){
	$db = new mysqli('localhost','root','','fdb');
	if ($db->connect_error) {
		die("Connection failed: " . $db->connect_error);
	} else return $db;
	$db->close();
}

$db = connectDB();

$content = file_get_contents("php://input");

if(isset($_POST['title'])) {
	if ($_POST['title'] == "mymovies") {
		getMovies();
	} else
	searchMovieInDatabase($_POST['title']);
} else {
	addMovieToDatabase($content);
};

function searchMovieInDatabase($content){
	
	$sql = "SELECT * FROM `movies` WHERE title= '" . $content . "'";
	$result = $GLOBALS['db']->query($sql);
	$empty = True;
	while ($row = mysqli_fetch_array($result)) {
		echo $row['title'];
		$empty = False;
	}
	//send 404 if movie not exists in DB
	if ($empty) {
		http_response_code(404);
	}
}

function addMovieToDatabase($content){

	http_response_code(200);

    $data = json_decode($content, true);
    
	$sql = "INSERT INTO movies (title, year, runtime, country) VALUES ('" . $data['Title']. "','" . $data['Year'] ."','" . $data['Runtime'] ."','" . $data['Country'] ."')";
	 if ($GLOBALS['db']->query($sql) === TRUE) {
	 	    echo "New record created successfully";
	 } else {
     	echo "Error: " . $sql . "<br>" . $GLOBALS['db']->error;
		}
}

function getMovies(){

	$sql = "SELECT * FROM `movies`";
	$result = $GLOBALS['db']->query($sql);
	$empty = True;
	header('Content-Type: application/json');
	$movie = array();
	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $movie[] = $row;
            $empty = False;
    }
    echo json_encode($movie);
	
	//send 404 if no movie exists in DB
	if ($empty) {
		http_response_code(404);
	}
}
?>