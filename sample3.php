<?php 

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\File;
use DB;
use App\Http\Controllers\Controller;

use Request;

class images1Controller extends Controller{

    public function getHome()
    {
        return view('croppic');
    }

    public function postUpload()
    {
        $form_data = Input::all();

        $validator = Validator::make($form_data, Image::$rules, Image::$messages);

        if ($validator->fails()) {

            return Response::json([
                'status' => 'error',
                'message' => $validator->messages()->first(),
            ], 200);

        }

        $photo = $form_data['img'];

        $original_name = $photo->getClientOriginalName();
        $original_name_without_ext = substr($original_name, 0, strlen($original_name) - 4);

        $filename = $this->sanitize($original_name_without_ext);
        $allowed_filename = $this->createUniqueFilename( $filename );

        $filename_ext = $allowed_filename .'.jpg';

        $manager = new ImageManager();
        $image = $manager->make( $photo )->encode('jpg')->save(env('UPLOAD_PATH') . $filename_ext );

        if( !$image) {

            return Response::json([
                'status' => 'error',
                'message' => 'Server error while uploading',
            ], 200);

        }

        $database_image = new Image;
        $database_image->filename      = $allowed_filename;
        $database_image->original_name = $original_name;
        $database_image->save();

        return Response::json([
            'status'    => 'success',
            'url'       => env('URL') . 'uploads/' . $filename_ext,
            'width'     => $image->width(),
            'height'    => $image->height()
        ], 200);
    }


    public function postCrop()
    {
        $form_data = Input::all();
        $image_url = $form_data['imgUrl'];
        $imgInitW = $form_data['imgInitW'];
        $imgInitH = $form_data['imgInitH'];
        // resized sizes
        $imgW = $form_data['imgW'];
        $imgH = $form_data['imgH'];
        // crop box
        $ratioH = $imgInitH/$imgH;
        $ratioW = $imgInitW/$imgW;
        $angle = $form_data['rotation'];
        $cropW = $form_data['width'];
        $cropH = $form_data['height'];
        $cropW1 = $cropW*$ratioW;
        $cropH1 = $cropH*$ratioH;
        $cropW2 = (int) $cropW1;
        $cropH2 = (int) $cropH1;
        $angle1 = $angle;

        // offsets
        
        $imgY1 = $form_data['imgY1'];
        $imgX1 = $form_data['imgX1'];
    
        $imgY2 = $imgY1*$ratioH;
        $imgX2 = $imgX1*$ratioW;
        $imgX3 = intval($imgX2);
        $imgY3 = (int) $imgY2;
        
        // rotation angle
        
        $ratioH = $imgInitH/$imgH;
        $ratioW = $imgInitW/$imgW;
        $filename_array = explode('/', $image_url);
        $filename = $filename_array[sizeof($filename_array)-1];
        $key = '';
        $keys = array_merge(range(0, 9), range('a', 'z'));

        for ($i = 0; $i < 20; $i++) {
            $key .= $keys[array_rand($keys)];
        }

        $filename1 = $filename . $key;
        $cropInitX =intval($imgInitW/2 - $imgInitW*cos($angle1)/2);
        $cropInitY = intval($imgInitH/2 - $imgInitH*cos($angle1)/2);
        $test = " /imageInitW=" . $imgInitW 
        . " \n/imageInitH=" . $imgInitH 
        . " \n/imageW=" . $imgW
        . " \n/imageH=" . $imgH
        . " \n/angle=" . $angle
        . " \n/imageY1=" . $imgY1
        . " \n/imageY2=" . $imgY2
        . " \n/imageY3=" . $imgY3
        . " \n/imageX1=" . $imgX1
        . " \n/imageX2=" . $imgX2
        . " \n/imageX3=" . $imgX3
        . " \n/ratioH=" . $ratioH
        . " \n/ratioW=" . $ratioW
        . " \n/cropW=" . $ratioH
        . " \n/cropH=" . $ratioH
        . " \n/cropInitX=" . $cropInitX
        . " \n/cropInitY=" . $cropInitY;

        mkdir('uploads/orders/'.$filename1);
        
        

        $manager = new ImageManager();
        $image = $manager->make($image_url);
        $filepath1 = $image_url;
        
            $type = exif_imagetype($filepath1); 
            $allowedTypes = array( 
                1,  // [] gif 
                2,  // [] jpg 
                3,  // [] png 
                6   // [] bmp 
            ); 
            if (!in_array($type, $allowedTypes)) { 
                return false; 
            } 
            switch ($type) { 
                case 1 : 
                    $im = imageCreateFromGif($filepath1); 
                break; 
                case 2 : 
                    $im = imageCreateFromJpeg($filepath1); 
                break; 
                case 3 : 
                    $im = imageCreateFromPng($filepath1); 
                break; 
                case 6 : 
                    $im = imageCreateFromBmp($filepath1); 
                break; 
            }    
            
        
        $rotate = imagerotate($im, $angle, 0);
        
        $rw = imagesx($rotate);
        $rh = imagesy($rotate);
        $newX=intval($rw * (1 - $imgInitW / $rw) * 0.5);
        $newY=intval($rh * (1 - $imgInitH / $rh) * 0.5);
        
        $image->rotate(-$angle)
        ->crop($imgInitW,$imgInitH,$newX,$newY)
        ->crop($cropW2,$cropH2, $imgX3 ,$imgY3)
            ->save(env('UPLOAD_PATH').'/orders/' .$filename1. '/cropped-' . $filename1 . '.png');

        if( !$image) {

            return Response::json([
                'status' => 'error',
                'message' => 'Server error while uploading',
            ], 200);

        }
        
        
        return Response::json([
            'status' => 'success',
            'url' => '/uploads/orders/'.$filename1.'/cropped-' . $filename1 . '.png',
            'filename' => $filename1
        ], 200);

    }

    private function sanitize($string, $force_lowercase = true, $analyt = false)
    {
        $strip = array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "[", "{", "]",
            "}", "\\", "|", ";", ":", "\"", "'", "&#8216;", "&#8217;", "&#8220;", "&#8221;", "&#8211;", "&#8212;",
            "â€”", "â€“", ",", "<", ".", ">", "/", "?");
        $clean = trim(str_replace($strip, "", strip_tags($string)));
        $clean = preg_replace('/\s+/', "-", $clean);
        $clean = ($analyt) ? preg_replace("/[^a-zA-Z0-9]/", "", $clean) : $clean ;

        return ($force_lowercase) ?
            (function_exists('mb_strtolower')) ?
                mb_strtolower($clean, 'UTF-8') :
                strtolower($clean) :
            $clean;
    }


    private function createUniqueFilename( $filename )
    {
        $upload_path = env('UPLOAD_PATH');
        $full_image_path = $upload_path . $filename . '.jpg';

        if ( File::exists( $full_image_path ) )
        {
            // Generate token for image
            $image_token = substr(sha1(mt_rand()), 0, 5);
            return $filename . '-' . $image_token;
        }

        
        return $filename;
    }
    public function saveToDB()
    {
        if (Request::ajax())
        {
            $photo = Input::get('photo');
            $orderId = Input::get('orderId');
            $amount = Input::get('amount');
            $type = Input::get('type');
            $peopleId = Input::get('peopleId');
            DB::table('ordersPhotos')->insert(
                ['photo' => $photo, 'orderId' => $orderId, 'amount' => $amount, 'type' => $type, 'peopleId' => $peopleId]
            );
            return Response::json($photo);
        }
    }
    public function savePersonToDB()
    {
        if (Request::ajax())
        {   $name = Input::get('name');
            $tel = Input::get('tel');
            $email = Input::get('email');
            
            $delivery = Input::get('delivery');
            $status = Input::get('status');
        
            $data = ['tel' => $tel,'name'=>$name, 'email' => $email,  'delivery' => $delivery, 'status' => $status];
            $id = DB::table('orders')->insertGetId( $data );
            return $id;
        }
    }
    public function print()
    {
        if (Request::ajax())
        {   $data = Input::get('array');
        for ($i = 0;$i<count($data);$i++) {
                $orderChangeId = intval($data[$i][1]);
                $orderUpdate = \App\orders::where('id','=',$orderChangeId)->first();
                $orderUpdate->status = 'readyForPrint';
                $orderUpdate->save();
            }
            if (count($data) % 2 == 0) {
                  
                } else {
                    $data[]=['1','1','promo','1','221.png'];
                }
        $finalArray = [];
        $firstLayer = "shablon.png"; // podlojka

        $firstLayerImg = imagecreatefrompng($firstLayer);
            for ($i = 0;$i<count($data);$i=$i+2) {
                
                $peopleFile = "uploads/".$data[$i][4]; // people
                $people2File = "uploads/".$data[$i+1][4]; // people2
                $faceFile = "uploads/orders/".$data[$i][2]."/cropped-".$data[$i][2].'.png';//face1
                $face2File = "uploads/orders/".$data[$i+1][2]."/cropped-".$data[$i+1][2].'.png'; //face2
                
                $x = 3780;
                $y = 5316;
                // dimensions of the final image
                $final_img = imagecreatetruecolor($x, $y);
                 $key = '';
                $keys = array_merge(range(0, 9), range('a', 'z'));
                for ($K = 0; $K < 10; $K++) {
                    $key .= $keys[array_rand($keys)];
                }
                $finalFilename = $data[$i][0] .'_'. $data[$i+1][0].'_'.$data[$i+1][0].'_'.$data[$i+1][0].'__'.$key.'.png';
                // Create our image resources from the files
                
                $image_2 = imagecreatefrompng($peopleFile);
                $image_22 = imagecreatefrompng($people2File);
                
                $image_4 = imagecreatefrompng($faceFile);
                $image_5 = imagecreatefrompng($face2File);

                list($width, $height) = getimagesize($faceFile);
                $thumb = imagecreatetruecolor(305, 409);
                $source = imagecreatefrompng($faceFile);
                imagecopyresized($thumb, $source, 0, 0, 0, 0, 305, 409, $width, $height);
                list($width1, $height1) = getimagesize($face2File);

                $thumb1 = imagecreatetruecolor(305, 409);
                $source1 = imagecreatefrompng($face2File);
                imagecopyresized($thumb1, $source1, 0, 0, 0, 0, 305, 409, $width1, $height1);
                
                imagealphablending($final_img, true);
                imagesavealpha($final_img, true);

                $verticalOffset = 818;
                $horizontalOffset = 2306-236;
                $faceX=152.1;
                $faceY=420-409+31;
                
                imagecopy($final_img, $firstLayerImg, 0, 0, 0, 0, 3780, 5316);


                for ($z=0;$z<6;$z++){
                    imagecopy($final_img, $thumb, 202+636-$faceX, 168+80+$faceY+$verticalOffset*$z, 0, 0, 305, 409);
                    imagecopy($final_img, $image_2, 202, 168+80+$verticalOffset*$z, 0, 0, 1272, 760);
                }

                for ($c=0;$c<6;$c++){
                    imagecopy($final_img, $thumb1, 202+636-$faceX+$horizontalOffset, 168+80+$faceY+$verticalOffset*$c, 0, 0, 305, 409);
                    imagecopy($final_img, $image_22, 202+$horizontalOffset, 168+80+$verticalOffset*$c, 0, 0, 1272, 760);
                }
                $horizontalOffset = 1007;
                $faceY=381;
                for ($a=0;$a<3;$a++){
                    $rotate = imagerotate($thumb, 180, 0);
                    $rotate1 = imagerotate($image_2, 180, 0);
                    imagecopy($final_img, $rotate, 202+636-$faceX+$horizontalOffset, 168+80+$faceY+$verticalOffset*$a, 0, 0, 305, 409);
                    imagecopy($final_img, $rotate1, 202+$horizontalOffset, 168+72+80+$verticalOffset*$a, 0, 0, 1272, 760);
                }
                for ($v=3;$v<6;$v++){
                    $rotate = imagerotate($thumb1, 180, 0);
                    $rotate1 = imagerotate($image_22, 180, 0);
                    imagecopy($final_img, $rotate, 202+636-$faceX+$horizontalOffset, 168+80+$faceY+$verticalOffset*$v, 0, 0, 305, 409);
                    imagecopy($final_img, $rotate1, 202+$horizontalOffset, 168+72+80+$verticalOffset*$v, 0, 0, 1272, 760);
                }
               
                imagepng($final_img,'users/'.$finalFilename);

                $finalArray[] = $finalFilename;
                   
            }
            
            return $finalArray;
        }
    }      
}
