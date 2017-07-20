//
//  OwnPanGestureRecognizer.m
//  RNCubeTransition
//
//  Created by Pavlo Aksonov on 19/07/2017.
//  Copyright © 2017 Thomas Lackemann. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OwnPanGestureRecognizer.h"
@implementation OwnPanGestureRecognizer
-(void)setTotalState:(enum UIGestureRecognizerState)state_ {
    self.state = state_;
}
@end
