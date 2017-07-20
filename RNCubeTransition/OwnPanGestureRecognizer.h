//
//  OwnPanGestureRecognizer.h
//  RNCubeTransition
//
//  Created by Pavlo Aksonov on 19/07/2017.
//  Copyright © 2017 Thomas Lackemann. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <UIKit/UIGestureRecognizerSubclass.h>

@interface OwnPanGestureRecognizer : UIPanGestureRecognizer {
}

-(void)setTotalState:(enum UIGestureRecognizerState)state;

@end
