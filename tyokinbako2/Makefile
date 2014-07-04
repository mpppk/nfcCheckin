CXX  = g++
SRCS  = tyokinbako.cpp
OBJS = $(SRCS:%.cpp=%.o)
DEPS = $(SRCS:%.cpp=%.d)
PROGRAM = tyokinbako
INCPASS = -I./

SSRCS = selectArea.cpp
SOBJS = $(SSRCS:%.cpp=%.o)
SDEPS = $(SSRCS:%.cpp=%.d)
SELECTPROG = selectArea

# OpenCV のライブラリを指定
OPENCVINC    = `pkg-config --cflags opencv`
OPENCVLIB    = `pkg-config --libs opencv`

all:            $(PROGRAM)

$(PROGRAM):	$(OBJS)
	$(CXX) -MMD $(FLAGS) -o $(PROGRAM) $(OBJS) $(INCPASS) $(OPENCVLIB) $(OPENCVINC)

$(SELECTPROG):	$(SOBJS)
	$(CXX) -MMD $(FLAGS) -o $(SELECTPROG) $(SOBJS) $(INCPASS) $(OPENCVLIB) $(OPENCVINC)

clean:;         rm -f *.o *~ $(PROGRAM)

-include $(DEPS)
